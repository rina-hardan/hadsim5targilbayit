CREATE DATABASE familyTree;

USE familyTree;
DROP TABLE IF EXISTS PersonTable;
DROP TABLE IF EXISTS FamilyRelations;
CREATE TABLE PersonTable (
    Person_Id INT PRIMARY KEY, 
    Personal_Name VARCHAR(20),  
    Family_Name VARCHAR(20), 
    Gender VARCHAR(20), 
    Father_Id INT, 
    Mother_Id INT, 
    Spouse_Id INT,
    FOREIGN KEY (Father_Id) REFERENCES PersonTable(Person_Id),
    FOREIGN KEY (Mother_Id) REFERENCES PersonTable(Person_Id),
    FOREIGN KEY (Spouse_Id) REFERENCES PersonTable(Person_Id)
);

CREATE TABLE FamilyRelations (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(20),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
    FOREIGN KEY (Person_Id) REFERENCES PersonTable(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES PersonTable(Person_Id)
);

DELIMITER $$

CREATE TRIGGER after_insert_family
AFTER INSERT ON PersonTable
FOR EACH ROW
BEGIN
    -- הוספת קשרי הורים
    IF NEW.Father_Id IS NOT NULL THEN
        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Person_Id, NEW.Father_Id, 'אב');

        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Father_Id, NEW.Person_Id, 
                CASE WHEN NEW.Gender = 'זכר' THEN 'בן' ELSE 'בת' END);
    END IF;

    IF NEW.Mother_Id IS NOT NULL THEN
        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Person_Id, NEW.Mother_Id, 'אם');

        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Mother_Id, NEW.Person_Id, 
                CASE WHEN NEW.Gender = 'זכר' THEN 'בן' ELSE 'בת' END);
    END IF;

    -- הוספת קשרי בני זוג
    IF NEW.Spouse_Id IS NOT NULL THEN
        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Person_Id, NEW.Spouse_Id, 'בן זוג');

        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        VALUES (NEW.Spouse_Id, NEW.Person_Id, 'בן זוג');
    END IF;

    -- הוספת קשרי אחים ואחיות
    IF NEW.Father_Id IS NOT NULL OR NEW.Mother_Id IS NOT NULL THEN
        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        SELECT NEW.Person_Id, P.Person_Id, 
               CASE WHEN P.Gender = 'זכר' THEN 'אח' ELSE 'אחות' END
        FROM PersonTable P
        WHERE P.Person_Id <> NEW.Person_Id
        AND (
            (P.Father_Id = NEW.Father_Id AND P.Father_Id IS NOT NULL)
            OR 
            (P.Mother_Id = NEW.Mother_Id AND P.Mother_Id IS NOT NULL)
        );

        INSERT IGNORE INTO FamilyRelations (Person_Id, Relative_Id, Connection_Type)
        SELECT P.Person_Id, NEW.Person_Id, 
               CASE WHEN NEW.Gender = 'זכר' THEN 'אח' ELSE 'אחות' END
        FROM PersonTable P
        WHERE P.Person_Id <> NEW.Person_Id
        AND (
            (P.Father_Id = NEW.Father_Id AND P.Father_Id IS NOT NULL)
            OR 
            (P.Mother_Id = NEW.Mother_Id AND P.Mother_Id IS NOT NULL)
        );
    END IF;
END $$

DELIMITER ;

INSERT INTO PersonTable (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) 
VALUES 
(11, 'משה', 'כהן', 'זכר', NULL, NULL, null),
(22, 'רחל', 'כהן', 'נקבה', NULL, NULL, 11),
(33, 'דוד', 'כהן', 'זכר', 11, 22, NULL),
(44, 'שרה', 'כהן', 'נקבה', 11, 22, NULL),
(55, 'יעקב', 'לוי', 'זכר', NULL, NULL, null),
(66, 'מרים', 'לוי', 'נקבה', NULL, NULL, 55),
(77, 'חנה', 'כהן', 'נקבה', 11, 22, NULL);
 -- השלמת הבני זוג עי הפורצדורה
CALL UpdateSpouses(); 
SELECT * FROM PersonTable;
SELECT * from FamilyRelations;
DELIMITER $$

CREATE PROCEDURE UpdateSpouses()
BEGIN
    UPDATE PersonTable p1
    JOIN FamilyRelations fr ON p1.Person_Id = fr.Person_Id
    JOIN PersonTable p2 ON fr.Relative_Id = p2.Person_Id
    SET p1.Spouse_Id = p2.Person_Id
    WHERE fr.Connection_Type = 'בן זוג' AND p1.Spouse_Id IS NULL
    AND p1.Person_Id > 0;
END $$

DELIMITER ;


