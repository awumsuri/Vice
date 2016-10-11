/**
 * Created by Mtui on 10/10/16.
 */
"use strict";

import http from "http";
import Message from "./model/message";
import Connection from "./model/connection"
import qs from "querystring";

class Server{

    constructor(options) {
        this.messages = [];
        const agent = http.globalAgent;

        options = Object.assign({}, options, {
            agent: agent
        });

        this.startServer(options);
    }

    startServer(options) {
        this._server = http.createServer((req, res) => {

            var body = "";

            res.on("error", (err) => {
                this.errorHandler(err, res);
            });

            req.on("error", (err) => {
                this.errorHandler(err);
            });

            req.on("data", (data) => {
                if(req.method === "POST")
                    body = body.concat(data);
            });

            req.on("end", (err)=>{
                if(err)
                    this.errorHandler(err);
                if(req.method.toUpperCase() === "POST" && req.url === "/message") {
                    let message = qs.parse(body).message;
                    this.messages.push(new Message(message, new Date()));
                    body = "";
                }
            });


            this.setHeaders(res);

            if(req.method.toUpperCase() === "POST") {

                res.writeHead(200, {"Content-Type": "text/plain"});

                switch (req.url) {
                    case "/":
                        res.end("You are connected to "
                            + options.hostname + ":" + options.port);
                        break;
                    case "/message":
                        res.end("1");
                        break;
                    case "/broadcast":
                        res.end("1");
                        break;
                    default:
                        res.end("FORBIDDEN");
                }

            }  else if(req.method.toUpperCase() === "GET") {

                switch (req.url) {
                    case "/":
                        res.end("You are connected to "
                            + options.hostname + ":" + options.port);
                        break;
                    case "/message":
                        var html = this.createHTMLMessageList();
                        res.writeHead(200, {
                            "Content-Type": "text/html",
                            "Content-Length": html.length
                        });
                        res.end(html);
                        break;
                    default:
                        res.end("FORBIDDEN");
                }
            }
        });

        this._server.on("clientError", (err, connection) => {
            connection.end("HTTP/1.1 400");
        } )

        this._server.on("error", (err)=> {
            this.errorHandler(err);
        });

        this._server.listen(options.port, options.hostname);
    }

    createHTMLMessageList() {
        var html = "<body><ol>";

        this.messages.forEach((message) => {
            html = html.concat("<li>"+message.message+"-"+message.time+"</li>");
        });
        html = html.concat("</ol></body>");

        return html;
    }

    setHeaders(res) {
        res.setHeader('access-control-allow-origin', '*');
        res.setHeader('access-control-request-method', '*');
        res.setHeader('access-control-allow-methods', 'POST, GET');
        res.setHeader('access-aontrol-allow-headers', '*');
        res.setHeader('connection', 'keep-alive');
    }

    errorHandler(err) {
        console.error(err);
    }
}

export default Server;
