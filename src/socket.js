/**
 * Created by Mtui on 10/11/16.
 */
import http from "http";

class Socket{
    constructor(options) {
        const agent = http.globalAgent;

        options = Object.assign({}, options, {
            agent: agent
        });

        this.connect(options);
    }

    connect(options) {
        const req = http.get(options, (res) => {
            res.on("error", (err) => {
                this.errorHandler(err);
            });
        })

        req.on("socket", (socket) => {
            console.log("socket connected");
        });
    }

    errorHandler(err) {
        console.error(err);
    }
}

export default Socket;
