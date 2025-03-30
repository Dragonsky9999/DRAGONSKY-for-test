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

const gridSize = 30;
const columns = 10;
const rows = 20;

let blockX = 5;
let blockY = 1;

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

//blockを描画
function draw_block(x, y){
    for (let i=0; i<current_shape.length; i++){
        for (let j=0; j<current_shape[i].length; j++){
            if (current_shape[i][j] === "1"){
                ctx.beginPath();
                ctx.fillStyle = blocktype.color;
                ctx.fillRect((x+i) * gridSize, (y-1+j) * gridSize , gridSize, gridSize);
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = "2";
                ctx.strokeRect((x+i) * gridSize, (y-1+j) * gridSize , gridSize, gridSize);
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
    if (blockX + current_shape.length >= 12) blockX = 11 - current_shape.length;
    requestAnimationFrame(drawBoard)

}

//画面をクリアして、ブロックを描画
function drawBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    draw_block(blockX, blockY);
}

//1秒毎にブロックを一つ下に移動
function update(){
    blockY++;
    if (blockY > rows) {
        blockY = 1;
    let num = Math.floor(Math.random() * 6);
    blocktype = block[num];
    current_shape = block[num].shape
    blockX = 5
}
    requestAnimationFrame(drawBoard)
}

//左右移動&回転
window.addEventListener("keydown", (event) =>{
    let key = event.key;

    if (key === "j" || key === "ArrowLeft"){
            if (blockX -1 > 0){
                blockX--;
            }
        requestAnimationFrame(drawBoard)
        }else if(key === "l" || key === "ArrowRight"){
            let shapeWidth = current_shape.length
            console.log(shapeWidth + blockX)
            if (blockX + shapeWidth < 11){
                blockX++;
            }
        requestAnimationFrame(drawBoard)
        }else if(key === ","){
        blockY = 20;
        requestAnimationFrame(drawBoard)
        }else if(key === "I"){
        blockY--;
        requestAnimationFrame(drawBoard)
        }else if(key === "k"){
        blockY++;
        requestAnimationFrame(drawBoard)
        }else if(key === "."){
        //右回転
        RotateShape();
        RotateShape();
        RotateShape();
    }else if(key === "m"){
        //左回転
        RotateShape();
    }
})

//loop
setInterval(update, 1000);

requestAnimationFrame(drawBoard)