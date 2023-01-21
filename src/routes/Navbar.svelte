<div class="navbar bg-base-100 p-4">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-4xl" href="/">gamedex</a>
	</div>
	<div class="flex-none gap-2">
		<div class="form-control">
			<input type="text" placeholder="Search" class="input input-bordered w-80" />
		</div>
		<div class="dropdown dropdown-end">
			<div class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<img src="https://placeimg.com/80/80/people" alt="propic" />
				</div>	
			</div>
			<ul class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
				<li>
					<button
						on:click={() => {
							console.log('Goint to the backlog page');
						}}>Backlog</button
					>
				</li>
				<li>
					<button
						on:click={() => {
							console.log('Logging out');
						}}>Logout</button
					>
				</li>
			</ul>
		</div>
	</div>
</div>
