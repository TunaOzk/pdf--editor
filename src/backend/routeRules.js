const express = require("express")
const cors = require("cors")
const fileUplaod = require("express-fileupload")
const app = express()
const port = 5000

app.use(fileUplaod({limit:'50mb', extended:true}))
// app.use(express.json({limit:'50mb', extended:true}))
app.use(cors())


app.post("/pdfFile2", async (req, res) => {
    console.log(req.files)
})

app.listen(port, () => {console.log("Listening...")})