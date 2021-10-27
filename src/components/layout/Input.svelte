<script>
	export let id;
	export let bindValue;
	export let isDisabled = false;
	export let onKeyup;

	console.log('bindValue', bindValue);
</script>

<style>

	input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {
	    display: none;
	    -webkit-appearance: none;
	    margin: 0;
	}

	input {
	  appearance: textfield;
	  -moz-appearance: textfield;
	  font-family: inherit;
	  font-size: inherit;
	  font-weight: inherit;
	  color: inherit;
	  outline: none;
	  border: 1px solid gray;
	  background-color: transparent;
	  width: 100%;
	  border-radius: 4px;
	}

	input::placeholder {
	  color: var(--dim-gray);
	  opacity: 1;
	}
	input::-ms-input-placeholder{
	  color: var(--dim-gray);
	}
	input:-ms-input-placeholder {
	  color: var(--dim-gray);
	}

</style>