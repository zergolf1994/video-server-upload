const { getStorageServer } = require("../utils/server.utils");

exports.findStorage = async (req, res) => {
  try {
    const server = await getStorageServer()  
    //.select(`_id sv_ip ssh_option`);
    return res.json(server);
  } catch (err) {
    return res.json({ error: true });
  }
};
