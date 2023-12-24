import pool from "../db.js";
import { mailer } from "../utils/nodemailler.js";
import { generateRandomPassword } from "../utils/randompassword.js";
import bcrypt from "bcrypt";
class Controller {
  async create(req, res) {
    try {
      const {
        type,
        firstName,
        lastName,
        organizationname,
        contactinfo,
        contractnumber,
      } = req.body;

      let newApplication;

      if (!!type && type === "Физическое") {
        newApplication = await pool.query(
          "INSERT INTO clients (clienttype, firstname,lastname, contactinfo,contractnumber) VALUES ($1, $2, $3, $4,$5) RETURNING *",
          [type, firstName, lastName, contactinfo, contractnumber]
        );
      }

      if (!!type && type === "Юридическое") {
        newApplication = await pool.query(
          "INSERT INTO clients (clienttype, organizationname, contactinfo,contractnumber) VALUES ($1, $2, $3, $4) RETURNING *",
          [type, organizationname, contactinfo, contractnumber]
        );
      }

      return res.json({
        newApplication: newApplication.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async get(req, res) {
    try {
      const ApplicationList = await pool.query(
        "SELECT * FROM clients WHERE activationstatus ='F' "
      );

      return res.json(ApplicationList.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async accept(req, res) {
    try {
      const applicationId = req.params.id;
      const password = generateRandomPassword(8);

      const application = await pool.query(
        "SELECT * FROM clients WHERE clientid = $1",
        [applicationId]
      );

      if (application.rows.length === 0) {
        return res.status(404).json({ error: "Клиент не найден." });
      }

      const message = {
        to: application.rows[0].contactinfo,
        subject: "Ваша заявка была одобренна",
        html: `
        <h2>Поздравляю теперь вы можете заходить на наш сайт ${application.rows[0].firstname} ${application.rows[0].lastname}</h2>
        <i>Данные вашей учетной записи</i>
        <ul>
        <li>Login:${application.rows[0].contactinfo}</li>
        <li>Password:${password}</li>
        </ul>

        `,
      };
      mailer(message);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        "INSERT INTO users (email, password_hash, roleid) VALUES ($1, $2, $3) RETURNING *",
        [application.rows[0].contactinfo, hashedPassword, 2]
      );

      const newUserId = newUser.rows[0].userid;

      const updatedClient = await pool.query(
        "UPDATE clients SET activationstatus = $1, userid=$2 WHERE clientid = $3",
        ["T", newUserId, applicationId]
      );
      return res.json({ user: newUser[0], client: updatedClient.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async refuse(req, res) {
    try {
      const applicationId = req.params.id;
      const { reason } = req.body;
      console.log(req.body);
      const application = await pool.query(
        "SELECT * FROM clients WHERE clientid= $1",
        [applicationId]
      );

      if (application.rows.length === 0) {
        return res.status(404).json({ error: "Клиент не найден." });
      }

      const message = {
        to: application.rows[0].contactinfo,
        subject: "Ваша заявка была отклоненна",
        text: `Причина отказа:${reason}`,
      };
      mailer(message);

      await pool.query("DELETE FROM clients WHERE clientid = $1", [
        applicationId,
      ]);

      res.status(200).json({ message: "Заявка удалена" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();
