const findPilotID = (connection, authorID, cb) => {
  connection.query(
    "SELECT pilotID FROM `pilots` WHERE discordID = ?",
    authorID,
    cb
  )
}

const findAirframe = (connection, nickname, cb) => {
  connection.query("SELECT id FROM airframes WHERE name = ?", nickname, cb)
}

module.exports = { findPilotID, findAirframe }
