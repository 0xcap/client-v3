<script>
	export let id;
	export let bindValue;
	export let isDisabled = false;
	export let onKeyup;
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

<input id={id} type='number' step="0.0001" bind:value={$bindValue} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" disabled={isDisabled} on:keyup={onKeyup} lang="en">