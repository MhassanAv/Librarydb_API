"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const admins_1 = __importDefault(require("./handlers/admins"));
const books_1 = __importDefault(require("./handlers/books"));
const reg_1 = __importDefault(require("./handlers/reg"));
const dashbored_1 = __importDefault(require("./handlers/dashbored"));
const app = (0, express_1.default)();
const address = 'http://localhost:3000/welcome';
app.use(body_parser_1.default.json());
//TODO loop or map on data to change it's shape
app.get('/welcome', (__req, res) => {
    res.send('<p><h1 style="color:blue";>Welcome to our library ! 🎉</h1>\nFollow the instructions at the readme file 📧</p>');
});
app.listen(3000, () => {
    console.log(`starting app on: ${address}`);
});
(0, admins_1.default)(app);
(0, books_1.default)(app);
(0, reg_1.default)(app);
(0, dashbored_1.default)(app);
exports.default = app;
