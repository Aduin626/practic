import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt.helpers.js";

class Controller {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log("Получен POST-запрос на /api/auth/login");

      const users = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (users.rows.length === 0)
        return res.status(404).json({ error: "Данный пользователь не найден" });

      const validPassword = await bcrypt.compare(
        password,
        users.rows[0].password_hash
      );
      if (!validPassword)
        return res.status(401).json({ error: "Неверный пароль" });

      const token = jwtTokens(users.rows[0]);

      return res.json({ token: `Bearer ${token}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async registerAdmin(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const fullName = `${firstName} ${lastName}`;

      const userAlreadyExists = await pool.query(
        "SELECT * FROM users WHERE email= $1",
        [email]
      );

      if (userAlreadyExists.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Такой email уже зарегистрирован" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = await pool.query(
        "INSERT INTO users (email, password_hash, roleid) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, 1] // Assuming role_id 2 represents the admin role
      );

      const newAdminId = newAdmin.rows[0].userid;

      const adminDetails = await pool.query(
        "INSERT INTO Admins (user_id, name) VALUES ($1, $2) RETURNING *",
        [newAdminId, fullName]
      );

      return res.json({
        admin: newAdmin.rows[0],
        adminDetails: adminDetails.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();
