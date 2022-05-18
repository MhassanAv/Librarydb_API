/* Replace with your SQL commands */
CREATE TABLE registrations(

    reg_NO SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    admin_id INT REFERENCES admins(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    user_name VARCHAR(255) NOT NULL,
    borrow_date DATE DEFAULT CURRENT_DATE,
    return_date DATE
    
);