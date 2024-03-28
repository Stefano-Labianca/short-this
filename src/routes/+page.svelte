<script lang="ts">
	import { enhance } from '$app/forms';
	import Toasts from '$lib/components/Toasts.svelte';
	import Copy from 'lucide-svelte/icons/copy';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Unlink from 'lucide-svelte/icons/unlink';
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
	let selectedLink = '';

	function copy(shortLink: string) {
		navigator.clipboard.writeText(shortLink);
	}

	const openDialog = writable<boolean>(false);

	const { errors: linkFormErrors, enhance: linkFormEnhance } = superForm(
		data.linkForm,
		{
			onUpdated({ form }) {
				if (form.valid) {
					alerts.add({
						title: 'Link uploaded successfully',
						variant: 'success'
					});
				}
			}
		}
	);

	const { enhance: removeLinkFormEnhance } = superForm(data.removeLinkForm, {
		onUpdate: () => {
			alerts.add({
				title: 'Link removed successfully',
				variant: 'error'
			});
		}
	});
</script>

<Toasts />

<div class="mt-24 mx-12 max-w-2xl">
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
			- [X] Rimozione singola
			- [] Rimozione multipla
		- [X] Convalida form di inserimento dei link
	-->

	<Tabs.Root class="space-y-8">
		<Tabs.List>
			<Tabs.Trigger value="create">Shorten a link</Tabs.Trigger>
			<Tabs.Trigger value="view">View your links</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="create">
			<Form.Root method="POST" action="?/save" enhance={linkFormEnhance}>
				<Form.Fields>
					<TextField.Root>
						<TextField.Label for="url">Your URL</TextField.Label>
						<TextField.Input
							disabled={creating}
							id="url"
							name="fullLink"
							placeholder="e.g. https://example.com"
						/>
						{#if $linkFormErrors?.fullLink}
							<div transition:slide|local={TRANSITION_BASE}>
								<TextField.Message variant="error">
									{$linkFormErrors.fullLink}
								</TextField.Message>
							</div>
						{/if}
					</TextField.Root>
				</Form.Fields>
				<Form.Controls>
					<Button.Root variant="successFilled" type="submit">
						Short this!
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

							<div class="w-full flex flex-row justify-evenly mt-4 gap-x-2">
								<Button.Root
									variant="info"
									class="w-full"
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
								<Button.Root
									class="w-full"
									type="submit"
									variant="error"
									on:click={() => {
										$openDialog = true;
										selectedLink = link.shortLink;
									}}
								>
									<Trash2 size={20} />
								</Button.Root>
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
					<Dialog.Title>Watch Out!</Dialog.Title>
					<Dialog.Description>
						Do you want to remove this link?
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close class="w-full flex flex-row gap-3 justify-between">
						<Button.Root class="w-full">Close</Button.Root>

						<Form.Root
							class="w-full gap-0"
							enhance={removeLinkFormEnhance}
							method="POST"
							action="?/delete"
						>
							<Form.Fields>
								<TextField.Input
									type="hidden"
									name="shortLink"
									value={selectedLink}
								/>
							</Form.Fields>

							<Form.Controls>
								<Button.Root class="w-full" type="submit" variant="error">
									Remove
								</Button.Root>
							</Form.Controls>
						</Form.Root>
					</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</div>
