const MongoClient = require('mongodb').MongoClient; // 로드
const url = "mongodb://localhost:27017";    //  접속 url
const dbName = "mydb";

//  클라이언트 생성
const client = new MongoClient(url, { useNewUrlParser: true });

//  접속 테스트
function testConnect() {
    client.connect((err, client) => {
        //  콜백
        /*
        if (err) {
            console.error(err);
        } else {
            console.log(client);
            client.close();
        }
        */
        client.connect()
        .then(client => {
            //  성공시
            console.log(client);
            client.close();
        })
        .catch(reason => {
            console.error(reason);
        })
    });
}
//testConnect();

//  한개 문서 insert
//  INSERT INTO mydb.friends VALUE(...);
//  db.friends.insert({ 문서 })
function testInsertOne(name) {
    client.connect()
    .then(client => {
        //  DB 선택
        const db = client.db("mydb");
        //  컬렉션 선택 후 쿼리 수행
        // console.log(db.collection("mydb"));
        db.collection("friends").insertOne({ name: name })
        .then(result => {
            console.log(result);
            console.log("새로 삽입된 문서의 ID:", result.insertedId);
            client.close()
        });
    })
    .catch(reason => {
        console.log(reason);
    })
}
//testInsertOne("홍길동");

//  다수 문서 삽입
//  INSERT INTO friends VALUE(...), (...), (...)
//  db.friends.insertMany([ { 문서 }, { 문서 }, ...])
function testInsertMany(names) {
    console.log(names, "는 배열?", Array.isArray(names));
    if (Array.isArray(names)) { //  names가 배열
        client.connect()
        .then(client => {
            const db = client.db("mydb");

            let data = names.map(item => {
                return {name: item};
            }); //  문서의 배열 생성
            console.log("삽입될 문서 목록:", data);
            db.collection("friends").insertMany(data)
            //  insertMany는 문서의 배열이 필요
            .then(result => {
                console.log(result.insertedCount, "개 삽입");
                client.close();
            })
        })

    } else {
        //  배열이 아니면
        testInsertOne(names);
    }
}
//testInsertMany(["고길동", "둘리", "도우너"]);
// testInsertMany("징길산");