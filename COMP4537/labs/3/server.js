const http = require('http');
const Utils = require('./modules/utils');
const messages = require('./lang/en/en');

const FILE_NAME = 'file.txt';

class HTTPServer
{
    constructor(port)
    {
        this.port = process.env.PORT || port;
    }

    startServer()
    {
        http.createServer((req, res) =>
        {
            //Had to separate the URL into base and path parameters as queryParams were not being read correctly
            const baseURL = `http://${req.headers.host}`;
            const parsedUrl = new URL(req.url, baseURL);

            if (parsedUrl.pathname.includes('/getDate/'))
            {
                this.handleGetDate(req, res, parsedUrl.searchParams);
            }
            else if (parsedUrl.pathname.includes('/writeFile/'))
            {
                const text = parsedUrl.searchParams.get('text');
                this.writeFile(res, FILE_NAME, text);
            }
            else if (parsedUrl.pathname.includes('/readFile/'))
            {
                // filename is taken from the search (e.g). /readFile/filename.txt
                const filename = parsedUrl.pathname.split('/readFile/')[1];
                this.readFileAndDisplay(res, filename);
            }
            else
            {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 Not Found');
            }
        }).listen(this.port);
        console.log(`Server running. Listening on port ${this.port}`);
    }

    handleGetDate(req, res, queryObject)
    {
        //Get name from query parameter
        const name = queryObject.get('name') || 'Guest';
        const currentDate = Utils.getDate();

        let greetingMessage = messages.greeting.replace('%1', name);
        const fullMessage = `<span style="color:blue">${greetingMessage} ${currentDate}</span>`;

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fullMessage);
    }

    // Appends to a file called with filename
    writeFile(res, filename, text)
    {
        const fs = require('fs');
        fs.appendFile(filename, text + '\n', (err) =>
        {
            if (err)
            {
                res.end(err);
            } else
            {
                res.end(messages.writeMsg.replace('%1', filename));
            }
        });
    }

    // Reads from a file called with filename
    readFileAndDisplay(res, filename)
    {
        const fs = require('fs');

        if(!filename){
            res.writeHead(400, {'Content-Type': 'text/html'});
            res.end(messages.errorNoFileName);
            return;
        }

        fs.readFile(filename, (err, text) =>
            {
                // If file doesnt exist, return 404 error message including the file name the user had requested
                if (err)
                {
                    console.error(messages.readingFileError.replace('%1', err.message));
                    const errMsg =  '404 Error: File ' + filename + ' not found.';


                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(errMsg);

                    return;
                }
                const fullMessage = `<span style="color:green">File Content:<br><pre>${text}</pre></span>`;

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(fullMessage);
            }
        );
    }
}
const server = new HTTPServer(3000);
server.startServer();