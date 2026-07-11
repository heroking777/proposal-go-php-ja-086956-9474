import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // Parse the incoming JSON message
        const data = JSON.parse(message.toString());

        // Handle different types of messages
        switch (data.type) {
            case 'chat':
                handleChatMessage(ws, data);
                break;
            case 'transaction':
                handleTransactionMessage(ws, data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the WebSocket chat!' }));
});

function handleChatMessage(ws: WebSocket, data: any) {
    // Broadcast the chat message to all connected clients
    wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'chat', user: data.user, message: data.message }));
        }
    });
}

function handleTransactionMessage(ws: WebSocket, data: any) {
    // Handle transaction logic here
    console.log('Transaction received:', data);

    // Example response
    ws.send(JSON.stringify({ type: 'transactionResponse', status: 'success', message: 'Transaction processed.' }));
}