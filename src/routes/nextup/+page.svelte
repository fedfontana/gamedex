<script lang="ts">
	import { addToast } from '$src/toast';
	import type { CalendarMonthEvent } from './types';

	let req = {
		month: 1,
		year: 2006,
	};

	let data: CalendarMonthEvent[] = [];
	async function sumbit_handler() {
		const response = await fetch(`/nextup?month=${req.month}&year=${req.year}`);
        if(response.ok) {
            data = await response.json();

        } else {
            addToast({
                type: "error",
                title: "error",
            });
        }
	}
</script>

<div class="flex flex-col gap-12 items-center w-full">
	<form on:submit|preventDefault={sumbit_handler} class="flex flex-row items-end gap-4">
        <div class="input-group flex-col">

            <label class="label" for="month">month</label>
            <input class="input input-bordered" name="month" type="number" min={1} max={12} bind:value={req.month} />
        </div>
        <div class="input-group flex-col">   

            <label class="label" for="year">year</label>
            <input class="input input-bordered" name="year" type="number" min={0} bind:value={req.year} />
        </div>
		<button class="btn btn-primary btn-square" type="submit">check</button>
	</form>
	<div class="flex flex-col gap-6 items-center mx-auto w-8/12">
		{#each data as e}
			<div class="border w-full">
				<h1 class="text-red-600">{e.type}</h1>
                <p class="flex flex-wrap">
                    {JSON.stringify(e.data, null ,2)}
                </p>
			</div>
		{/each}
	</div>
</div>
