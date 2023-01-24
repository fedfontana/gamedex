<script lang="ts">
    //! Current logic is broken
    //! It looks kinda ugly if days >= 100

	export let end_time: Date;

	let missing_time = {
		years: 0,
		days: 109,
		hours: 0,
		minutes: 0,
		seconds: 0
	};

	function daysIntoYear(date: Date) {
		return (
			(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
				Date.UTC(date.getFullYear(), 0, 0)) /
			24 /
			60 /
			60 /
			1000
		);
	}

	if (new Date() < end_time) {
		let timeout = setInterval(() => {
			let current_time = new Date();

			missing_time = {
				years: end_time.getFullYear() - current_time.getFullYear(),
				days: daysIntoYear(end_time) - daysIntoYear(current_time), //! WRONG
				hours: 0,
				minutes: 0,
				seconds: 0
			};

			if (current_time >= end_time) {
				missing_time = {
					years: 0,
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0
				};
				clearInterval(timeout);
			}
		}, 1000);
	}
</script>

<div class="grid grid-flow-col gap-5 text-center auto-cols-max">
	{#if missing_time.years > 0}
		<div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
			<span class="countdown font-mono text-5xl">
				<span style="--value:{missing_time.years};" />
			</span>
			years
		</div>
	{/if}
	{#if missing_time.days > 0}
		<div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
			<span class="countdown font-mono text-5xl">
				{#if missing_time.days >= 100}
					<span style="--value:{Math.floor(missing_time.days / 100)};" />
					<span style="--value:{missing_time.days % 100};" />
				{:else}
					<span style="--value:{missing_time.days};" />
				{/if}
			</span>
			days
		</div>
	{/if}
	<div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
		<span class="countdown font-mono text-5xl">
			<span style="--value:{missing_time.hours};" />
		</span>
		hours
	</div>
	<div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
		<span class="countdown font-mono text-5xl">
			<span style="--value:{missing_time.minutes};" />
		</span>
		min
	</div>
	<div class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
		<span class="countdown font-mono text-5xl">
			<span style="--value:{missing_time.seconds};" />
		</span>
		sec
	</div>
</div>
