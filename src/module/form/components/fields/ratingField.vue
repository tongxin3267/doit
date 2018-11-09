<template>
    <div class="field-content" >
		<div class="rating-field"
				 :class="{readOnly:field.readonly||field.disabled}"
				 :disabled="field.readonly||field.disabled"
		>
			<span class="rating-field-item"
				  :class="{heart:field.rating_type === 'heart',active:rate>=index}"
				  v-for="index in length" 
          @click="setRate(index)"
			>
			</span>
		</div>
    </div>
</template>

<script>
  export default {
    props: {
      field:{type:Object}
    },
    data () {
      return {
        length:5,
        value:0,
        over: 0,
        rate: 0,
      }
    },
    methods: {
      setRate (index) {
		if(this.field.disabled) return;
        this.rate = index
        var key = this.field._id;
        var value = index;
        console.log({key,value})
        this.$emit('change',{key,value})
      },
    },
    created () {
      this.length = this.field.choices.length;
      this.value = this.field.value||0;
      if (this.value >= this.length) {
        this.value = this.length
      } else if (this.value < 0) {
        this.value = 0
      }
      this.rate = this.value
      this.over = this.value
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.rating-field {
		padding:10px;
		border-radius: 4px;
	}

	.rating-field-item {
		display: inline-block;
		width: 22px;
		height: 22px;
    background: url(../../../../assets/images/icon_form_score-stars-unselected.png) no-repeat;
    background-size: 100%;
		margin-right: 7px;
		vertical-align: text-bottom;
	}
	.rating-field-item.active {
		background: url(../../../../assets/images/icon_form_score-stars-checked.png) no-repeat;
    background-size: 100%;
	}
	.rating-field-item.heart {
		background: url(../../../../assets/images/icon_form_score-love-unselected.png) no-repeat;
    background-size: 100%;
	}
	.rating-field-item.heart.active {
		background: url(../../../../assets/images/icon_form_score-love-checked.png) no-repeat;
    background-size: 100%;
	}

</style>
