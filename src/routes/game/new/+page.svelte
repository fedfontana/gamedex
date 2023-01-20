<script lang="ts">
	const PLATFORMS = [
		'PS5',
		'PS4',
		'PS3',
		'PS2',
		'PS1',
		'PSP',
		'PSVita',
		'XBX',
		'XB1',
		'XB360',
		'Steam',
		'Epic Store',
		'PC',
		'DS',
		'3DS',
		'Switch',
		'Wii',
		'WiiU',
		'GameCube',
		'SNES',
		'NES',
		'GBA',
		'GBC',
		'Nintendo64',
		'iOS',
		'android',
		'Sega Genesis',
		'Atari 2600'
	] as const;
	type Platform = (typeof PLATFORMS)[number];

	const STATUSES = [
		'backlog',
		'watchlist',
		'wishlist',
		'retired',
		'playing',
		'paused',
		'finished'
	] as const;
	type Status = (typeof STATUSES)[number];
</script>


<h2 class="mx-auto text-3xl font-semibold w-fit mb-12">Create new game</h2>
<form class="flex flex-col gap-6 w-10/12 mx-auto">
	<div class="flex flex-row gap-6 items-center justify-center">
		<div class="form-control w-full max-w-md">
			<label class="label" for="name">
				<span class="label-text"> game name </span>
			</label>
			<input id="name" type="text" placeholder="Name" class="input input-bordered" />
		</div>

		<div class="form-control w-full max-w-md">
			<label class="label" for="short_name">
				<span class="label-text"> short game name </span>
			</label>
			<input id="short_name" type="text" placeholder="Short name" class="input input-bordered" />
		</div>
	</div>

	<div class="flex flex-row gap-4 items-center justify-center">
		<div class="form-control w-full max-w-xs">
			<label class="label" for="art_url">
				<span class="label-text"> Art url </span>
			</label>
			<input id="art_url" type="text" placeholder="Art url" class="input input-bordered" />
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="developer">
				<span class="label-text"> Developer </span>
			</label>
			<input id="developer" type="text" placeholder="Developer" class="input input-bordered" />
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="release_date">
				<span class="label-text"> Release date </span>
			</label>
			<input
				id="release_date"
				type="date"
				placeholder="Release date"
				class="input input-bordered"
			/>
		</div>
	</div>

	<div class="flex flex-row gap-4 items-center justify-center">
		<div class="form-control w-full max-w-xs">
			<label class="label" for="status">
				<span class="label-text"> Status </span>
			</label>
			<select id="status" name="Status" class="select select-bordered">
				{#each STATUSES as status}
					<option value={status}> {status} </option>
				{/each}
			</select>
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="platform">
				<span class="label-text"> Platform </span>
			</label>
			<select id="platform" name="Platform" class="select select-bordered">
				{#each PLATFORMS as platform}
					<option value={platform}> {platform} </option>
				{/each}
			</select>
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="play_time">
				<span class="label-text"> Play time </span>
			</label>
			<input
				id="play_time"
				type="number"
				min={0}
				placeholder="Play time"
				class="input input-bordered"
			/>
		</div>
	</div>

    <div class="w-10/12 mx-auto flex justify-end">
        <button type="submit" class="btn btn-primary max-w-xs">Create game</button>
    </div>
</form>
