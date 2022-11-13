const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];
var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
options_data = JSON.parse(json);

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		difficulty: options_data.dificulty,
		num_cards: options_data.cards,
		bad_clicks: 0
	},
	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}
		let temps = 0;
		switch(this.difficulty){
			case "hard":
				this.numDif = 5;
				temps = 0; //Innecessari però es posa per claredat
				break;
			case "normal":
				this.numDif = 2.5;
				temps = 2500;
				break;
			case "easy":
				this.numDif = 1;
				temps = 5000;
				break;
			default:
				break;
		}

		this.myTimeout = setTimeout(this.timeout, temps);
		this.pausa = false;

	},
	methods: {
		cartaIncorrecta: function(){
			console.log("Carta Incorrecta")
			Vue.set(this.current_card, this.actual, {done: false, texture: back});
			Vue.set(this.current_card, this.i_front, {done: false, texture: back});
			this.pausa = true;
		},
		timeout: function(){
			console.log(this.difficulty);
			this.pausa = true;
			for (var i = 0; i < this.items.length; i++) {
				Vue.set(this.current_card, i, {done: false, texture: back});
			}
			clearTimeout(this.timeout);
		},
		clickCard: function(i){
			if (this.pausa && !this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if(this.pausa){
				if (value.texture === back) return;
				var front = null;
				this.i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					this.actual = i;
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								this.myTimeout = setTimeout(this.cartaIncorrecta, 1000);
								this.pausa = false;
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							this.i_front = i;
						}
					}
				}			
			}
		}
	},
	computed: {
		score_text: function(){
			//Link calcul dificultat: https://www.geogebra.org/classic/vw3yqucd
			let punts = 100 * this.numDif * this.num_cards_total - this.bad_clicks * (10 * this.numDif * this.num_cards_total + Math.pow(1.83, 2 * this.numDif)) ;
			console.log("Dificultat ", this.numDif, ": ",100 * this.numDif * this.num_cards_total, " - ", this.bad_clicks * (10 * this.numDif * this.num_cards_total + Math.pow(1.83, 2 * this.numDif)),": " ,punts);
			return punts;
		}
	}
});





