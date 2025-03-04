<template>
	<div
		class="loading-container"
		v-if="loading">
		<div class="loading-wrapper">
			<div class="loading-spinner">
				<svg
					class="circular"
					viewBox="25 25 50 50">
					<circle
						class="path"
						cx="50"
						cy="50"
						r="20"
						fill="none"
						stroke-width="3"
						stroke-miterlimit="10" />
				</svg>
			</div>
			<p class="loading-text">{{ text }}</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: "LoadingComponent",
		props: {
			text: {
				type: String,
				default: "您要访问的页面正在加载中...",
			},
			loading: {
				type: Boolean,
				default: true,
			},
		},
	};
</script>

<style scoped lang="scss">
	.loading-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		background-color: rgba(255, 255, 255, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loading-wrapper {
		text-align: center;
	}

	.loading-spinner {
		margin: 0 auto;
		width: 50px;
		height: 50px;
		position: relative;
	}

	.loading-text {
		margin-top: 15px;
		color: #409eff;
		font-size: 14px;
	}

	.circular {
		animation: rotate 2s linear infinite;
		height: 100%;
		transform-origin: center center;
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
	}

	.path {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: 0;
		stroke: #409eff;
		stroke-linecap: round;
		animation: dash 1.5s ease-in-out infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}
</style>
