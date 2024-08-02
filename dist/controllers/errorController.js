"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError500 = void 0;
const handleError500 = (req, res) => {
    res.redirect('/500');
};
exports.handleError500 = handleError500;
