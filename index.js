const server = require("./server");

const port = 8000;
server.listen(port, () => console.log(`Server Listening On Port: ${port}`));
