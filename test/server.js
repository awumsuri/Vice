"use strict";

import {expect} from "chai";
import itEach from "it-each";
import request from "request";
import Server from "../src/server"

const PORT = 7775;
const SERVER_URL = "http://localhost:"+PORT;

itEach({testPreIteration: true});

describe("Server Test", () => {

    const server = new Server({
        hostname: "localhost",
        port: PORT
    });

    describe("Does server initialize correctly", ()=>{

        var statusCode = 0;

        beforeEach((done)=>{
            const req = request(SERVER_URL, (err, res, body) => {
                statusCode = res.statusCode;
                done()
            });
        });

        it("Return 200", () => {
            expect(statusCode).to.equal(200);
        });

    });

    describe("Messages stored correctly", ()=>{

        const ITERATION = [1,2,3,4,5,6,7,8,9];
        const options = {
            url:SERVER_URL+"/messages",
            "content-type": "application/x-www-form-urlencoded",
            "body": "message=whattimeisit"
        };

        let statusCode = 0;

        beforeEach((done) => {
            statusCode = 0;
            request.post(options, (err, res, body) => {
                statusCode = res.statusCode;
                done();
            });
        })

        it.each(ITERATION, "Message sent successfully - Interation %s", ['element'], () => {
            expect(statusCode).to.equal(200);
        });

    });

    describe("Messages returned correctly", () => {

        const MAX_COUNT = 10;
        const options = {
            url:SERVER_URL+"/messages"
        };

        let counter;
        let html;

        beforeEach((done)=>{
            for(let i = 0; i < MAX_COUNT; i++){
                request.get(options, (err, res, body) => {
                    if (counter == MAX_COUNT-1) {
                        html = res.body;
                        done();
                    }

                    counter++;
                });
            }
        });

        it("")



    })
})

