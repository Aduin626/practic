CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    RoleID INT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);


CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(user_id),
    name VARCHAR(50) NOT NULL,

);


CREATE TABLE Clients (
    ClientID SERIAL PRIMARY KEY,
    ClientType VARCHAR(20) NOT NULL, -- 'Физическое' или 'Юридическое'
    FirstName VARCHAR(50),            -- Для физических лиц
    LastName VARCHAR(50),             -- Для физических лиц
    OrganizationName VARCHAR(100),    -- Для юридических лиц
    ContactInfo VARCHAR(255) NOT NULL,
    ContractNumber VARCHAR(20),
    ActivationStatus VARCHAR(10) DEFAULT F
    UserID INTEGER,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);