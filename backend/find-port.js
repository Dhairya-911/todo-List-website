const net = require('net');

function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

findAvailablePort().then(port => {
  console.log(`Available port found: ${port}`);
});
