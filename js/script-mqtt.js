'use strict';
let lines = [];
let messagesLastMinuteCount = 0, client;
const port = 443;
let topic = "";

window.setInterval(logMessageCount, 60*1000);

window.onload = updateTopicTemplate;

function connect() {
    const clientId = "testclient_" + now();
    const host = $("#domain").val();
    topic = $("#topic").val();
    console.log("Trying to connect to road mqtt " + host + ":" + port + " Topic: " + topic + " client id: " + clientId);

    client = new Paho.Client(host, port, clientId);

    client.onConnectionLost = function (response) {
        $("#connectionStatus").text(new Date().toISOString() + ' Connection lost: ' + response.errorCode+ ': ' + response.errorMessage);
        console.info(new Date().toISOString() + ' Connection lost: ' + response.errorCode+ ': ' + response.errorMessage);
    };

    client.onMessageArrived = function(message) {
        messagesLastMinuteCount++;
        console.log(message.destinationName + ': ' + message.payloadString);
        try {
            if (message.destinationName.endsWith("status")) {
                console.log(message.destinationName + ': ' + message.payloadString);
            } else if (message.payloadString.startsWith("<?xml")) {
                addMessage(message.destinationName, "\n" + escapeXml(message.payloadString));
            } else {
                addMessage(message.destinationName, JSON.stringify(JSON.parse(message.payloadString)));
            }
        } catch (error) {
            // not json or xml, try decompress
            try {
                const json = decompressGzipToString(message.payloadString)
                addMessage(message.destinationName,
                    "\nRAW: " + message.payloadString + "\nDECOMPRESSED: \"" + JSON.stringify(JSON.parse(json)) + "\"");
            } catch (errorIn) {
                console.error("addMessage failed " + error);
                console.info(message);
            }
        }

        updateList();
    };


    const connectionProperties = {
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure,
        reconnect: true,
        cleanSession:false,
        mqttVersion:4,
        useSSL:true
    };

    client.connect(connectionProperties);
}

function disconnect() {
    try {
        if (client && client.isConnected) {
            client.disconnect();
            $("#connectionStatus").text(new Date().toISOString() + ' Disconnected');
        }
    } catch(err) {
        console.error(err.message);
    }
}

function logMessageCount() {
    console.info(now() + ' ' + messagesLastMinuteCount + ' messages per minute');
    $("#messagesPerMinute").text(messagesLastMinuteCount);
    messagesLastMinuteCount = 0;
}

function onConnectSuccess() {
    console.info(now() + ' Connection open. Subscribing to topic ' + topic);
    $("#connectionStatus").text(new Date().toISOString() + ' Connected, topic: ' + topic);
    client.subscribe(topic);
}

function onConnectFailure(response) {
    console.info(now() + ' Connection failed .' + response.errorCode + ": " + response.errorMessage);
    $("#connectionStatus").text(new Date().toISOString() + ' Connection failed. ' + response.errorCode + ": " + response.errorMessage);
}

function addMessage(destination, message) {
    const text = destination + ': ' + message;

    while (lines.length > 100) {
        lines.shift();
    }

    lines.push(text);
}

function updateList() {
    $("#messages").html(lines.join('<br/>'));
}

function updateTopicTemplate() {
    $("#topic").val($("#topic_select").val());
    console.log("updateTopicTemplate changed to " + $("#topic").val());
}

function reconnect() {
    messagesLastMinuteCount = 0;
    $("#messages").html('');
    $("#messagesPerMinute").text(0);
    disconnect();
    lines = [];
    connect();
}

function decompressGzipToString(gzippedB64Data) {
    // Decode the base64 encoded data to ASCII string
    const gzippedData = atob(gzippedB64Data);
    // Convert ASCII string to UTF-8 byte array
    const gzippedDataArray = Uint8Array.from(gzippedData, c => c.charCodeAt(0))
    // Unzip byte array to UTF-8 byte array
    const ungzippedData = pako.ungzip(gzippedDataArray);
    // Decode UTF-8 byte array to string
    return new TextDecoder().decode(ungzippedData);
}

function escapeXml(unsafeXml) {
    return unsafeXml.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function now() {
    return new Date().toISOString();
}