<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { is_logged_in } from '$src/stores';
	import { addToast } from '$src/toast';

	let errors: Record<string, string> | undefined = undefined;
	let form_errors: string[] | undefined = undefined;

	let next = $page.url.searchParams.get('next') ?? '/';

	const handle_login_submit: SubmitFunction = () => {
		return async ({ form, result }) => {
			switch (result.type) {
				case 'success':
					$is_logged_in = true;
					addToast({
						type: 'success',
						title: 'Login successfull'
					});
					addToast({
						type: 'info',
						title: `You will be redirected to ${$page.url.origin}${next} in 2 seconds`
					});
					setTimeout(() => {
						goto(next);
					}, 2000);
					break;
				case 'failure':
					form.reset();
					errors = result.data?.errors;
					form_errors = result.data?.form_errors;
					break;
				case 'error':
					addToast({
						type: 'error',
						title: 'Error',
						message: 'There was an error logging you in'
					});
					break;
			}
		};
	};
</script>

<form
	method="POST"
	use:enhance={handle_login_submit}
	class="flex flex-col gap-12 w-[28rem] mx-auto"
>
	<h2 class="mx-auto text-3xl font-semibold mb-6">Login</h2>

	{#if form_errors !== undefined}
		<div class="flex flex-col items-center gap-2">
			{#each form_errors as error}
				<span class="text-error">
					{error}
				</span>
			{/each}
		</div>
	{/if}

	<div class="flex flex-col gap-4 items-center justify-center">
		<div class="form-control w-full">
			<label class="label" for="username">
				<span class="label-text"> Username </span>
			</label>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				name="username"
				type="text"
				placeholder="Username"
				class="input input-bordered {errors?.username ? 'input-error' : ''}"
				value=""
				required
				autofocus
			/>
			{#if errors?.username}
				<label class="label flex flex-col items-baseline" for="username">
					{#each errors.username as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>

		<div class="form-control w-full">
			<label class="label" for="password">
				<span class="label-text"> Password </span>
			</label>
			<input
				name="password"
				type="password"
				placeholder="Password"
				class="input input-bordered {errors?.password ? 'input-error' : ''}"
				value=""
			/>
			{#if errors?.password}
				<label class="label flex flex-col items-baseline" for="password">
					{#each errors.password as error}
						<span class="label-text text-error">{error}</span>
					{/each}
				</label>
			{/if}
		</div>
	</div>

	<div class="w-full mx-auto flex justify-end">
		<button type="submit" class="btn btn-primary max-w-xs"> Login </button>
	</div>
</form>
