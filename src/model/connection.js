/**
 * Created by Mtui on 10/10/16.
 */

class Connection {
    constructor(req, res) {
        this.response = res;
        this.addListners(req, res);
    }

    addListners(req, res) {

        res.on("end", (req, res) => {
            res.destroy();
            req.destroy();
            console.log("response destroyed");
        });
    }

    broadcast(data) {
        this.response.end(data);
    }
}

export default Connection;
