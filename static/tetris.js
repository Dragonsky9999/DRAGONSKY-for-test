const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


//背景表示
function drawBackground(){

    ctx.beginPath();
    ctx.fillStyle = "rgb(100 110 200 / 50%)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.moveTo(15,0);
    ctx.lineTo(15,630);
    ctx.lineWidth = "30";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(345,0);
    ctx.lineTo(345,630);
    ctx.lineWidth = "30";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(15,615);
    ctx.lineTo(375,615);
    ctx.lineWidth = "30";
    ctx.stroke();

}
drawBackground();

//block
// 20行 10列のボードを作成
let board = [];
for (let row = 0; row < 20; row++) {
    board[row] = [];
    for (let col = 0; col < 10; col++) {
        board[row][col] = "0";  // 初期値として "0" をセット
    }
}const gridSize = 30;
const columns = 10;
const rows = 20;

let blockX = 4;
let blockY = 0;

const I = {
    "shape":[
    ["1","1","1","1"]
    ],
    "color": "rgb(45, 195, 255)"}
const O = {
    "shape":[
    ["1","1"],
    ["1","1"]
    ],
    "color": "rgb(255, 255, 0)"}
const T = {
    "shape":[
    ["0","1","0"],
    ["1","1","1"]
    ],
    "color": "rgb(255, 0, 255)"}
const Z = {
    "shape":[
    ["1","1","0"],
    ["0","1","1"]
    ],
    "color": "rgb(255, 37, 84)"}
const S = {
    "shape":[
    ["0","1","1"],
    ["1","1","0"]
    ],
    "color": "rgb(0, 255, 0)"}
const L = {
    "shape":[
    ["1","1","1"],
    ["1","0","0"]
    ],
    "color": "rgb(255, 136, 0)"}
const J = {
    "shape":[
    ["0","0","1"],
    ["1","1","1"]
    ],
    "color": "rgb(0, 0, 255)"}


const block = [I, O, T, Z, S, L, J]
let num = Math.floor(Math.random() * 6);
let blocktype = block[num];
let current_shape = block[num].shape
let shapeHeight = current_shape[0].length

//blockを描画
function draw_block(x, y){
    for (let i=0; i<current_shape.length; i++){
        for (let j=0; j<current_shape[i].length; j++){
            if (current_shape[i][j] === "1"){
                ctx.beginPath();
                ctx.fillStyle = blocktype.color;
                ctx.fillRect((blockX + j + 1) * gridSize, (blockY + i) * gridSize , gridSize, gridSize);
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = "2";
                ctx.strokeRect((blockX + j + 1) * gridSize, (blockY + i) * gridSize , gridSize, gridSize);
            }
        }
    }
}

//blockを回転
function RotateShape(){
    let shapeRows = current_shape.length;
    let shapeCols = current_shape[0].length;
    let newShape = Array.from({ length: shapeCols }, () => []);
    for (let col=0; col<shapeCols; col++){
        for (let row=0; row<shapeRows; row++){
            newShape[col][shapeRows - 1 -row] = current_shape[row][col]
        }
    }
    current_shape = newShape
    if (blockX + current_shape[0].length > 10) blockX = 10 - current_shape[0].length;
    requestAnimationFrame(drawBoard)

}

//画面をクリアして、ブロックを描画
function drawBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    for (let i=0; i<board.length; i++){
        for (let j=0; j<board[i].length; j++){
            if (board[i][j] === "1"){

                ctx.beginPath();
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect((j+1)*gridSize, i*gridSize, gridSize, gridSize);
                ctx.lineWidth = "2";
                ctx.strokeStyle = "rgb(0, 0, 0)";
                ctx.strokeRect((j+1)*gridSize, i*gridSize, gridSize, gridSize);
                
            }
        }
    }
    draw_block(blockX, blockY)
}

//新しいテトリミノを生成
function spawnBlock(){
        let num = Math.floor(Math.random() * 6);
        blocktype = block[num];
        current_shape = block[num].shape
        blockX = 4;
        blockY = 0;
        requestAnimationFrame(drawBoard);
}

//テトリミノを置く
function placeblock(){
    for (let row=0; row<current_shape.length; row++){
        for (let col=0; col<current_shape[row].length; col++)
            if (current_shape[row][col] === "1"){
                let BoardRow = blockY + row;
                let BoardCol = blockX + col;
                board[BoardRow][BoardCol] = "1";
                console.log(board)
            }
    }
}          

//1秒毎にブロックを一つ下に移動
function update(){
    let shapeHeight = current_shape.length
    if (blockY + shapeHeight < 20 ){
        blockY++;
        requestAnimationFrame(drawBoard);
    }else{
        placeblock();
        spawnBlock();
    }
}
//loop
setInterval(update, 1000);

//下へ動ける？
function canMoveDown(){
    for (let row=0; row<current_shape.length; row++){
        for (let col=0; col<current_shape[row].length; col++){
            if (current_shape[row][col] === "1"){
                let BoardRow = blockY + row;
                let BoardCol = blockX + col;
                let newRow = BoardRow + 1;

                if (newRow > board.length) return false;
                if (board[newRow][BoardCol] === "1"){
                    return false;
                }else if (board[newRow][BoardCol] == "undefined"){
                    return false;
                }
            }
        }
    }
    return true;
}



//左右移動&回転
window.addEventListener("keydown", (event) =>{
    let key = event.key;
    console.log(key)
    //左へ
    if (key === "j" || key === "ArrowLeft"){
        if (blockX > 0){
            blockX--;
        }
        requestAnimationFrame(drawBoard)
    //右へ
    }else if(key === "l" || key === "ArrowRight"){
        let shapeWidth = current_shape[0].length
        if (blockX + shapeWidth < 10){
            blockX++;
        }
    requestAnimationFrame(drawBoard)
    //急降下
    }else if(key === ","){
        let shapeHeight = current_shape.length
        blockY = 21 - shapeHeight;
        if (canMoveDown()){
            requestAnimationFrame(drawBoard)
        }
    //上へ（チート）
    }else if(key === "I"){
        blockY--;
        requestAnimationFrame(drawBoard)
    //下へ
    }else if(key === "k"){
        if (canMoveDown()){
            blockY++;
            requestAnimationFrame(drawBoard)
        }else{
            placeblock();
            spawnBlock();
        }
    //右回転
    }else if(key === "u"){
        RotateShape();
        RotateShape();
        RotateShape();
    //左回転
    }else if(key === "o"){
        RotateShape();
    //スポーン（チート）
    }else if(key === "S"){
        spawnBlock();
    }
})


requestAnimationFrame(drawBoard);