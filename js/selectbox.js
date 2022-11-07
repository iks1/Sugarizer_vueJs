/**
 * @module SelectBox
 * @desc This is an dropdown component to select any option
 * @vue-prop {Object.<Object>} options - stores data of options to be displayed in popup and dedault option in select-bar
 * @vue-data {Object} [selectedData=null] - select-bar data object value
 * @vue-data {Boolean} [showselectBox=false] - condition to display popup of options
 * @vue-data {Number} [xData=null] - left position of popup
 * @vue-data {Number} [yData=null] - top position of popup
 * @vue-data {Number} [popupKey=0] - key of popup component
 * @vue-data {Number} [iconKey=0] - key of icon component 
 */
const SelectBox ={
	name: 'SelectBox',
	template: `
		<div ref="selectBox" class="selectbox-border" v-if="optionsData">
			<div class="selectbox-bar" v-on:click="showPopup($event)" v-if="this.selectedData">
				<icon class="selectbox-icon"
					:key="this.iconKey"
					:id="'optionsData.id'+selectedData.icon.id"
					:svgfile=selectedData.icon.iconData
					:color=selectedData.icon.color
					:size=selectedData.icon.size
					:x=selectedData.icon.iconx
					:y=selectedData.icon.icony
				></icon>
				<div class="selectbox-text">{{ selectedData.name }}</div>
				<div class="selectbox-arrow"></div>
			</div>
			<popup ref="selectboxPopup" 
				class="selectbox-popup"
				:key="this.popupKey" 
				v-show="this.showselectBox"
				:item="this.optionsData"
				v-on:mouseleave="removePopup($event)"
				v-on:itemis-clicked="optionisSelected($event)"
			></popup>
		</div>
	`,
	props: ['options'],
	components: {
		'popup': Popup, 
		'icon': Icon
	},
	data() {
		return {
			optionsData: this.options? this.options: null,
			selectedData: {
				icon: this.options? this.options.icon: null,
				name: this.options? this.options.name: null,
			},
			showselectBox: false,
			xData: null,
			yData: null,
			popupKey: 0,
			iconKey: 0
		}
	},
	watch: {
		optionsData: function(newData, oldData) {
			this.optionsData = newData
		},
	},
	methods: {
		/** 
		 * @memberOf module:SelectBox.methods
		 * @method removePopup
		 * @desc check for the cursor position and call hide() of popup component 
		 * @param {Event} e - click event data to get the cursor position
		 */
		removePopup(e) {
			if(!this.$refs.selectboxPopup.isCursorInside(e.clientX, e.clientY)){
				this.$refs.selectboxPopup.hide();
				this.showselectBox= false;
				this.popupKey= !this.popupKey;
			}
		},
		/** 
		 * @memberOf module:SelectBox.methods
		 * @method optionisSelected
		 * @desc excuted on the emit 'itemis-clicked' from popup component, set the select-bar data and emit optionSelected with the selected option
		 * @param {String} str - sotred selected option data in <popupComponentId+'_'+optionName> format
		 */
		optionisSelected(str) {
			const selectedDataName = str.split('_').pop();
			if(this.optionsData.name==selectedDataName) {
				this.selectedData= {
					icon: this.optionsData.icon,
					name: this.optionsData.name
				}
			} else {
				var item = this.optionsData.itemList.filter((item) => {
					return item.name==selectedDataName;
				})
				this.selectedData= {
					icon: item[0].icon,
					name: item[0].name
				}
			}
			this.showselectBox= false;
			this.iconKey= !this.iconKey;
			this.popupKey= !this.popupKey;
			this.$emit('optionSelected',this.selectedData);
		},
		/** 
		 * @memberOf module:SelectBox.methods
		 * @method showPopup
		 * @desc get the top and left offset of select-box and call show(x,y) of popup component with positions as parameter of popup
		 */
		showPopup() {
			if(this.showselectBox) {
				this.showselectBox= false;
				return;
			}
			var offsets = this.$refs.selectBox.getBoundingClientRect();
			var top = offsets.top;
			var left = offsets.left;
			var x, y;
			y= top- 18;
			x= left+ 8;
			this.$refs.selectboxPopup.show(x,y);
			this.showselectBox= true;
		}
	}
};

if (typeof module !== 'undefined') module.exports = { SelectBox }