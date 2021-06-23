const chai = require('chai');
const chaiHttp = require('chai-http');
const server = "http://localhost:9091";
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('/POST get area of outlet successfully', () => {
  it('Get area of outlet successfully when sending correct coordinates', (done) => {
    chai.request(server)
      .post('/outlets/findoutletbycoord')
      .send({
        "coords" : [48.19345078, 16.40338733],
      })
      .end((err, res) => callback(err, res, function (msg, data) {
        expect(res).to.have.status(200);
        expect(msg).to.be.a("string").and.to.equal("OK");
        expect(data).to.be.an("Array");
        if(data[0]){
          expect(data[0]).to.have.keys(['idx','name', 'loc']);
          expect(data[0].name).to.be.a("string");
        }
      }, done));
  });
});

describe('/POST error case of missing post field', () => {
  it('Get error of incorrect data', (done) => {
    chai.request(server)
      .post('/outlets/findoutletbycoord')
      .send({})
      .end((err, res) => callback(err, res, function (msg, data) {
        expect(res).to.have.status(400);
        expect(msg).to.be.a("string").and.to.equal("Bad Request");
      }, done));
  });
});

describe('/POST error case of missing one value in coordinates', () => {
  it('Get error of incorrect data', (done) => {
    chai.request(server)
      .post('/outlets/findoutletbycoord')
      .send({coords: [1]})
      .end((err, res) => callback(err, res, function (msg, data) {
        expect(res).to.have.status(400);
        expect(msg).to.be.a("string").and.to.equal("Bad Request");
      }, done));
  });
});

describe('/POST error case of request body coordinates is not an array', () => {
  it('Get error of incorrect data', (done) => {
    chai.request(server)
      .post('/outlets/findoutletbycoord')
      .send({coords: {lat: 1, lng: 2}})
      .end((err, res) => callback(err, res, function (msg, data) {
        expect(res).to.have.status(400);
        expect(msg).to.be.a("string").and.to.equal("Bad Request");
      }, done));
  });
});


function callback(err, res, fn, done) {
  if (err) return done(err);
  expect(res.text).to.be.a("string");
  let { responseResult, responseData } = JSON.parse(res.text);
  if (fn) fn(responseResult, responseData);
  done();
}
