import axios from "axios";

export default function handler(req, res) {
    console.log(req.body.text);
    res.status(200).json({ text: 'Hello' });
}