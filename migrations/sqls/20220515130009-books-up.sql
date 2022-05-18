/* Replace with your SQL commands */
CREATE TABLE books(
    
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publication_date VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    status VARCHAR(255)
);

INSERT INTO books (title, publication_date, author, category, status) VALUES ('Greatbook1','2009','Greatauthor1','Arts','Available');
INSERT INTO books (title, publication_date, author, category, status) VALUES ('Greatbook2','2009','Greatauthor2','Tech','Available');
INSERT INTO books (title, publication_date, author, category, status) VALUES ('Greatbook3','2007','Greatauthor3','History','Available');
INSERT INTO books (title, publication_date, author, category, status) VALUES ('Greatbook4','1983','Greatauthor4','History','Available');
INSERT INTO books (title, publication_date, author, category, status) VALUES ('Greatbook5','2015','Greatauthor5','Astro','Available');