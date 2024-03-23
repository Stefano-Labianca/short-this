<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Toasts from '$lib/components/Toasts.svelte';
	import { Copy, Trash2, Unlink } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';

	import {
		Button,
		Dialog,
		EmptyState,
		Form,
		Label,
		TRANSITION_BASE,
		Tabs,
		TextField,
		alerts
	} from 'virtue-ui';

	export let data: PageServerData;

	$: links = data.links;

	let creating = false;

	function copy(shortLink: string) {
		navigator.clipboard.writeText(shortLink);
	}

	const openDialog = writable<boolean>(false);

	const { errors, enhance: actionEnhance } = superForm($page.data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				alerts.add({
					title: 'Link uploaded successfully',
					variant: 'success'
				});
			}
		}
	});
</script>

<Toasts />

<div class="mt-24 mx-12">
	<h1 class="flex justify-center items-center text-4xl font-bold mb-10">
		Short This
	</h1>

	<p class="text-base mb-10">
		Shorten your link without worrying about registration and take track of all
		your links up to 7 days!
	</p>

	<!-- TODO:
		- [] Aggregare per data -> Con la paginazione
		- [X] Alert di notifica
			- [X] Inserimento
			- [X] Rimozione
			- [X] Copia
		- [] Rimozione automatica dei link dopo 7 giorni
		- [] Modale per conferma di rimozione del record
			- [] Rimozione singola
			- [] Rimozione multipla
		- [X] Convalida form di inserimento dei link
	-->

	<Tabs.Root class="space-y-8">
		<Tabs.List>
			<Tabs.Trigger value="create">Shorten a link</Tabs.Trigger>
			<Tabs.Trigger value="view">View your links</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="create">
			<Form.Root method="POST" action="?/save" enhance={actionEnhance}>
				<Form.Fields>
					<TextField.Root>
						<TextField.Label for="url">Your URL</TextField.Label>
						<TextField.Input
							disabled={creating}
							id="url"
							name="fullLink"
							placeholder="e.g. https://example.com"
						/>
						{#if $errors?.fullLink}
							<div transition:slide|local={TRANSITION_BASE}>
								<TextField.Message variant="error">
									{$errors.fullLink}
								</TextField.Message>
							</div>
						{/if}
					</TextField.Root>
				</Form.Fields>
				<Form.Controls>
					<Button.Root variant="successFilled" type="submit">
						Submit
					</Button.Root>
				</Form.Controls>
			</Form.Root>
		</Tabs.Content>

		<Tabs.Content value="view">
			{#if links.length == 0}
				<EmptyState.Root class="mt-20">
					<EmptyState.Asset>
						<Unlink size={64} />
					</EmptyState.Asset>
					<EmptyState.Header>
						<EmptyState.Description>
							No short links found.
						</EmptyState.Description>
					</EmptyState.Header>
				</EmptyState.Root>
			{:else}
				<div class="flex flex-col gap-y-12 mb-32">
					{#each links as link (link.shortLink)}
						<div
							class="flex flex-col"
							transition:slide|global={TRANSITION_BASE}
							animate:flip={TRANSITION_BASE}
						>
							<Label.Root for="short-link" class="mb-2">
								{new Date(link.createdAt).toDateString()}
							</Label.Root>
							<Button.Root
								id="short-link"
								variant="infoFilled"
								href={link.fullLink}
							>
								{link.shortLink}
							</Button.Root>

							<div class="flex flex-row justify-evenly mt-4 gap-x-2">
								<Button.Root
									class="w-full"
									variant="info"
									on:click={() => {
										copy(link.shortLink);
										alerts.add({
											title: 'Copied to the clipboard',
											variant: 'success'
										});
									}}
								>
									<Copy size={20} />
								</Button.Root>

								<Form.Root
									class="w-full gap-0"
									{enhance}
									method="POST"
									action="?/delete"
								>
									<Form.Fields>
										<TextField.Input
											type="hidden"
											value={link.shortLink}
											name="shortLink"
										/>
									</Form.Fields>

									<Form.Controls>
										<Button.Root
											type="submit"
											variant="error"
											on:click={() =>
												alerts.add({
													title: 'Link removed successfully',
													variant: 'error'
												})}
										>
											<Trash2 size={20} />
										</Button.Root>
									</Form.Controls>
								</Form.Root>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Tabs.Content>
	</Tabs.Root>

	<Dialog.Root open={openDialog}>
		<Dialog.Portal>
			<Dialog.Overlay />
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Title</Dialog.Title>
					<Dialog.Description>Description</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close>
						<Button.Root>Close</Button.Root>
					</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</div>
