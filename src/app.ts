import express from 'express'
import { config } from 'dotenv'
import fs from 'fs'

config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.json())

// Endpoint to read table data from JSON file
app.get('/readMainTable', (req, res) => {
  try {
    const jsonData = fs.readFileSync('data/tableData.json', 'utf-8')
    const tableData = JSON.parse(jsonData)
    res.json(tableData)
  } catch (error) {
    console.error('Error reading JSON file:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Endpoint to write table data to JSON file
app.post('/writeMainTable', (req, res) => {
  try {
    const tableData = req.body // req.body is automatically parsed by express.json
    const jsonData = JSON.stringify(tableData, null, 2)
    fs.writeFileSync('data/tableData.json', jsonData, 'utf-8')
    res.send('Table data written to JSON file successfully!')
  } catch (error) {
    console.error('Error writing to JSON file:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
