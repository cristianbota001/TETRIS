window.onload = () => {

    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");

    /* canvas.width = document.querySelector(".main_canvas").clientWidth */
    canvas.height = document.querySelector(".main_canvas").clientHeight

    var block_width = 25
    var block_height = 25

   /*  var LEN_MAP_C = canvas.width / block_width */
    var LEN_MAP_C;
    var LEN_MAP_R = canvas.height / block_height

	var map, move_flag = false, game_over = false

	/* var mop; */

	var best_score = 0, score = 0, lines = 0

    class Engine{
        
		constructor(){
			this.AddKeyEvents()
			this.DisplayScore()
        }

        ResetMap(){
            map = new Array()
            /* mop = new Array() */
            for (var r = 0; r < LEN_MAP_R; r ++){
                map.push(new Array())
                /* mop.push(new Array()) */
                for (var c = 0; c < LEN_MAP_C; c ++){
                    map[r][c] = [0, ""]
                    /* mop[r][c] = 0 */
                }
            }
        }

		DisplayScore(){
			document.querySelector(".best_score").innerHTML = best_score
			document.querySelector(".score").innerHTML = score
			document.querySelector(".lines").innerHTML = lines
		}

		AddKeyEvents(){
			document.addEventListener("keypress", (e) => {
				if (move_flag){
					if (e.key == "d"){
						if (this.block.RightAndLeftMoveCheck(LEN_MAP_C - 1, 1)){
							this.block.RightAndLeftMove(0, -1)
							this.block.RemoveShadowBlock()
							this.block.block_x += block_width
							this.block.c_m ++;
							this.block.PrintShadowBlock()
							this.block.PrintBlock()
						}
					}
					if (e.key == "a"){
						if (this.block.RightAndLeftMoveCheck(0, -1)){
							this.block.RightAndLeftMove(this.block.max_cb - 1, 1)
							this.block.RemoveShadowBlock()
							this.block.block_x -= block_width
							this.block.c_m --;
							this.block.PrintShadowBlock()
							this.block.PrintBlock()
						}
					}
					if (e.key == "w"){
						if (this.block.CheckRotate()){
							this.block.RotateBlock()
							this.block.PrintShadowBlock()
							this.block.PrintBlock()
						}
					}
					if(e.key == "s"){
						if (this.dwn){
							this.vel = 30
							this.dwn = false
						}
					}
				}
			})
			document.addEventListener("keyup", (e) => {
				if(e.key == "s"){
					this.vel = 350
					this.dwn = true
				}
				/* if (e.key == "q"){
					this.AnimateBlock()
				} */
			})
		}

		RandomBlock(){
			switch (Math.floor(Math.random() * 5) + 1) {
				case 1: return new Block(4, 4, [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
				case 2: return new Block(2, 2, [1,1,1,1])
				case 3: return new Block(3, 3, [1,0,0,1,0,0,1,1,0])
				case 4: return new Block(3, 3, [1,0,0,1,1,0,0,1,0])
				case 5: return new Block(3, 3, [1,1,1,0,1,0,0,0,0])
			}	
		}

		NextBlock(){
			this.next_block = this.RandomBlock()
			var cnv = document.querySelector(".blocks_window")
			var context = cnv.getContext("2d");
			document.querySelector(".blocks_window").style.width = (this.next_block.max_cb * block_width).toString() + "px"
			document.querySelector(".blocks_window").style.height = (this.next_block.max_rb * block_height).toString() + "px"
			cnv.width = document.querySelector(".blocks_window").clientWidth
			cnv.height = document.querySelector(".blocks_window").clientHeight
			this.next_block.PrintNextBlock(context)
		}

		ClearNextBlock(){
			var cnv = document.querySelector(".blocks_window")
			var context = cnv.getContext("2d");
			context.clearRect(0,0,cnv.width, cnv.height)
		}

		IncScore(inc){
			score += inc
			
			if (score > best_score){
				best_score = score
			}

			this.DisplayScore()
		}

		IncLines(inc){
			lines += inc
			this.DisplayScore()
		}

		PrintAll(){
			ctx.clearRect(0,0, canvas.width, canvas.height)
			var y = 0, x = 0
			for (var r = 0; r < LEN_MAP_R; r ++){
                for (var c = 0; c < LEN_MAP_C; c ++){
					if (map[r][c][0] == 2){
						ctx.beginPath()
						ctx.rect(x, y, block_width, block_height);
						ctx.fillStyle = map[r][c][1]
						ctx.fill() 
					}
					x += block_width
                }
				x = 0
				y += block_height
            }
		}

		CheckLine(){
			var contr = true, contr2 = false
			for (var r = 0; r < this.block.max_rb; r++) {
				if ((this.block.r_m - 1 + r) < LEN_MAP_R){
					map[this.block.r_m - 1 + r].forEach(element => {
						if (element[0] != 2){
							contr = false
						}
					});
					if (contr == true){
						contr2 = true
						this.ScoreLine(this.block.r_m - 1 + r)
					}
					contr = true;
				}
			}
			if (contr2){
				this.PrintAll()
			}
		}

		ScoreLine(row){
			var arr = new Array(LEN_MAP_C)
			for (var i = 0; i < LEN_MAP_C; i ++) {arr[i] = [0, ""]}
			map.splice(row, 1)
			map.unshift(arr)
			this.RemoveRow(row)
			this.IncScore(100)
			this.IncLines(1)
		}

		RemoveRow(row){
			ctx.clearRect(0, row * block_height, LEN_MAP_C * block_width, block_height)
		}

		Start(){
			this.vel = 350
			this.dwn = true
			this.engine = true
			this.block = this.RandomBlock()
			this.ResetMap()
			this.NextBlock()
			this.block.PrintShadowBlock() 
			this.AnimateBlock()
		}

		async AnimateBlock(){	
			if (this.engine){
				new Promise((resolve, reject) => {
					move_flag = true
					this.block.PrintBlock()
					if (this.vel == 30) {this.IncScore(1)}
					setTimeout(() => {resolve("ok")}, this.vel)
				}).then(value => {
					move_flag = false
					if (this.block.CheckFloor()){
						this.block.RemoveBlock()
						this.block.block_y += block_height
						this.block.r_m ++;
						this.AnimateBlock()
					}else{
						setTimeout(() => {
							if (!game_over) {
								this.CheckLine()
								this.vel = 350 
								this.block = this.next_block
								this.NextBlock()
								this.block.PrintShadowBlock() 
								this.AnimateBlock()
							}
						}, 200)
					}
				})
			}
			
		}
    }

    class Block{
        constructor(mr, mc, arr){
            this.c_m = Math.floor(Math.random() * LEN_MAP_C / 3) + Math.floor(LEN_MAP_C / 3)
            this.r_m = 1
            this.block_x = block_width * this.c_m
            this.block_y = 0
            this.max_rb = mr
            this.max_cb = mc
            this.arr = arr
			this.inv = false
			this.Color()
            this.SetMat()
        }

        SetMat(){
            this.ResetMat()
            for (var r = 0; r < this.max_rb; r ++) {
                for (var c = 0; c < this.max_cb; c ++) {
                    this.mat[r][c] = this.arr[(r * this.max_cb) + c]
                }
            }
        }

        ResetMat(){
            this.mat = new Array()
            for (var r = 0; r < this.max_rb; r ++){
                this.mat.push(new Array())
                for (var c = 0; c < this.max_cb; c ++){
                    this.mat[r][c] = 0
                }
            }
        }

		RotateBlock() {
			var pos = this.max_rb - 1, new_arr = new Array()
			for (var r = 0; r < this.max_rb; r++) {
				for (var c = 0; c < this.max_cb; c++) {
					if (!this.inv) {
						new_arr.push(this.arr[c * this.max_cb + r])
					}
					else {
						new_arr.push(this.arr[c * this.max_cb + pos])
					}
				}
				pos--;
			}

			this.arr = new_arr
			this.inv = !this.inv;
			this.RemoveAllBlocks()
			this.RemoveShadowBlock()
			this.SetMat()
		}

        OptionDecorator(func, mode, bx, by, rm, cm){
			var ris = null
            var y = by
            for (var r = 0; r < this.max_rb; r++) {
                var x = bx
                for (var c = 0; c < this.max_cb; c++) {
					if (this.mat[r][c] == 1 && mode){
						ris = func(r, c, x, y, rm, cm)
					} else if (this.mat[r][c] == 0 && !mode){
						ris = func(r, c, x, y, rm, cm)
					}
					if (ris == false) {return false}
					x += block_width
				}
				y += block_height
            }
			return true;
        }

		PrintBlock(){
			const func = (r, c, x, y, rm, cm) => {
				ctx.beginPath()
				ctx.rect(x, y, block_width, block_height);
				ctx.fillStyle = this.color
				ctx.fill() 
			}
			return this.OptionDecorator(func, true, this.block_x, this.block_y, null, null)
		}

		RemoveBlock(){
			const func = (r, c, x, y, rm, cm) => {
				if (r == 0 || this.mat[r - 1][c] == 0) {
					ctx.clearRect(x, y, block_width, block_height)
				}
			}
			return this.OptionDecorator(func, true, this.block_x, this.block_y, null, null)
		}

		RightAndLeftMove(num, num2){
			const func = (r, c, x, y, rm, cm) => {
				if (c == num || this.mat[r][c + num2] == 0) {
					ctx.clearRect(x, y, block_width, block_height)
				}
			}
			return this.OptionDecorator(func, true, this.block_x, this.block_y, null, null)
		}

		CheckFloor(){
			const func = (r, c, x, y, rm, cm) => {
				if (rm + r == LEN_MAP_R || map[rm + r][c + cm][0] == 2) {
					this.FixBlock()
					return false;
				}
			}
			return this.OptionDecorator(func, true, null, null, this.r_m, this.c_m)
		}

		FixBlock(){
			const func = (r, c, x, y, rm, cm) => {
				map[rm - 1 + r][cm + c][0] = 2;
				/* mop[this.r_m - 1 + r][this.c_m + c] = 2; */
				map[rm - 1 + r][cm + c][1] = this.color;
				this.PrintBlock()
				this.CheckGameOver(rm)
			}
			this.OptionDecorator(func, true, null, null, this.r_m, this.c_m)
			/* console.log(mop) */
		}

		RightAndLeftMoveCheck(num, num2){
			const func = (r, c, x, y, rm, cm) => {
				if (c + cm == num || map[r + rm - 1][c + cm + num2][0] == 2) {
					return false;
				}
			}
			return this.OptionDecorator(func, true, null, null, this.r_m, this.c_m)
		}

		RemoveAllBlocks(){
			const func = (r, c, x, y, rm, cm) => {
				ctx.clearRect(x, y, block_width, block_height)
			}
			return this.OptionDecorator(func, true, this.block_x, this.block_y, null, null)
		}

		CheckRotate(){
			const func = (r, c, x, y, rm, cm) => {
				if ((cm + c >= LEN_MAP_C || rm + r >= LEN_MAP_R) || (cm + c < 0 || map[rm + r][cm + c][0] == 2 )) {
					return false;
				}
			}
			return this.OptionDecorator(func, false, null, null, this.r_m, this.c_m)
		}

		Color(){
			var r = (Math.floor(Math.random() * 255) + 1), b = (Math.floor(Math.random() * 255) + 1);
			this.color = "rgb(" + (r).toString() + ",20," + (b).toString() + ")"
		}

		PrintNextBlock(context){
			const func = (r, c, x, y, rm, cm) => {
				context.beginPath()
				context.rect(x, y, block_width, block_height);
				context.fillStyle = this.color
				context.fill() 
			}
			this.OptionDecorator(func, true, 0, 0, null, null)
		}

		CheckGameOver(rm){
			if (rm <= 1){
				game_over = true;
				var formData = new FormData()
				formData.append('best_score', best_score);
				new Index().PostSomething(formData)
			}
		}

		ShadowBlock(){
			const func = (r, c, x, y, rm, cm) => {
				if (rm + r == LEN_MAP_R || map[rm + r][c + cm][0] == 2) {
					return false;
				}
			}

			var rm = this.r_m, y = this.block_y

			while (this.OptionDecorator(func, true, null, null, rm, this.c_m)){
				rm ++;
				y += block_height;
			}

			return y;
		}

		PrintShadowBlock(){
			const func2 = (r, c, x, y, rm, cm) => {
				ctx.beginPath()
				ctx.rect(x, y, block_width, block_height);
				ctx.fillStyle = "rgb(96, 170, 142)"
				ctx.fill() 
			}
			this.OptionDecorator(func2, true, this.block_x, this.ShadowBlock(), null, null)
		}

		RemoveShadowBlock(){
			const func = (r, c, x, y, rm, cm) => {
				ctx.clearRect(x, y, block_width, block_height)
			}
			this.OptionDecorator(func, true, this.block_x, this.ShadowBlock(), null, null)
		}
    }

	class Index{
		Start(){
			this.st = true
			this.GetAll()
			this.AddMenuButtonsEvent()
		}

		AddMenuButtonsEvent(){
			document.querySelector(".options").addEventListener("click", () => {
				document.querySelector(".blur_cont").style.filter = "blur(5px)"
				document.querySelector(".option_menu").style.display = "flex"
			})
			document.querySelector(".exit_button").addEventListener("click", () => {
				document.querySelector(".blur_cont").style.filter = "blur(0px)"
				document.querySelector(".option_menu").style.display = "none"
			})
			document.querySelector(".start_stop").addEventListener("click", () => {
				if (this.st){
					this.eng_ogg.Start()
					this.st = false
					document.querySelector(".start_stop").innerHTML = "Stop"
				}else{
					this.eng_ogg.engine = false
					ctx.clearRect(0,0,canvas.width, canvas.height)
					this.st = true
					document.querySelector(".start_stop").innerHTML = "Start"
					this.eng_ogg.ClearNextBlock()
					score = 0
					document.querySelector(".score").innerHTML = 0
					var formData = new FormData();
					formData.append('best_score', best_score);
					this.PostSomething(formData)
				}
				
			})
		}

		GetAll() {
			fetch("/TETRIS_API/tetris_api.php/?get_all").then(value => {
				return value.text()
			}).then(value => {
				value = JSON.parse(value)
				best_score = value.best_score
				document.querySelector(".main_canvas").setAttribute("width", value.canvas_width)
				canvas.width = document.querySelector(".main_canvas").clientWidth
				document.querySelector("#input_text_canvas_width").setAttribute("value", canvas.width)
				LEN_MAP_C = canvas.width / block_width;
				this.eng_ogg = new Engine()
			})
		}

		PostSomething(body){
			fetch("/TETRIS_API/tetris_api.php/", {
				method:"POST", 
				body:body
			}).then(value => {
				if (!value.ok){
					alert("OH OH!")
				}

				console.log("ok")
			})
		}
	}

	new Index().Start()

}