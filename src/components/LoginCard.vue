<template>
	<div class="outer_in">
		<div class="change">
			<div
				:class="{ Afont: true, active: activeTab === 'login' }"
				@click="changeTab('login')">
				登录
			</div>
			<div
				:class="{ Afont: true, pad: true, active: activeTab === 'register' }"
				@click="changeTab('register')">
				注册
			</div>
		</div>
		<form
			class="form"
			v-if="ifLogin">
			<div class="flex-column">
				<label>用户名 </label>
			</div>
			<div class="inputForm">
				<svg
					height="20"
					viewBox="0 0 32 32"
					width="20"
					xmlns="http://www.w3.org/2000/svg">
					<g
						id="Layer_3"
						data-name="Layer 3">
						<path
							d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
					</g>
				</svg>
				<input
					type="text"
					class="input"
					placeholder="用户名"
					v-model="Loginform.username" />
			</div>

			<div class="flex-column">
				<label>密码 </label>
			</div>
			<div class="inputForm">
				<svg
					height="20"
					viewBox="-64 0 512 512"
					width="20"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
					<path
						d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
				</svg>
				<input
					:type="inputType"
					class="input"
					placeholder="密码"
					v-model="Loginform.password"
					@keydown.enter="Logins" />
				<svg
					viewBox="0 0 576 512"
					height="1em"
					xmlns="http://www.w3.org/2000/svg"
					@click.prevent="toggleInputType">
					<path
						d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
				</svg>
			</div>

			<button
				type="button"
				class="button-submit"
				@click.prevent="Logins"
				@keydown.enter="Logins">
				登 录
			</button>

			<p class="p">
				没 有 账 号 ?
				<span
					class="span"
					@click.prevent="changeTab('register')"
					>注 册 一 个</span
				>
			</p>
		</form>
		<form
			class="Rform"
			v-if="!ifLogin">
			<div class="labels top">
				<el-input
					type="text"
					placeholder="用户名"
					v-model="Registerform.username"
					class="labinner">
					<i
						slot="prefix"
						class="el-input__icon el-icon-user"
						style="color: #252727"></i
				></el-input>
			</div>
			<div class="labels">
				<el-input
					type="text"
					placeholder="密码"
					class="labinner"
					v-model="Registerform.password">
					<i
						slot="prefix"
						class="el-input__icon el-icon-lock"
						style="color: #252727"></i
				></el-input>
				<div class="remember-me">
					<input
						type="checkbox"
						id="remember-me"
						v-model="rememberMe" />
					<label for="rememberMe">记住我</label>
				</div>
			</div>
			<div class="labels">
				<el-input
					type="email"
					placeholder="邮箱"
					class="labinner"
					v-model="Registerform.email">
					<i
						slot="prefix"
						class="el-input__icon el-icon-message"
						style="color: #252727"></i
				></el-input>
			</div>
			<div class="code-outer">
				<el-input
					type="text"
					placeholder="验证码"
					class="code"
					v-model="Registerform.code"
					><i
						slot="prefix"
						class="el-input__icon el-icon-postcard"
						style="color: #252727"></i
				></el-input>
				<el-button
					class="ecode"
					@click.prevent="sendCode"
					round>
					发送
				</el-button>
			</div>
			<el-button
				class="reg"
				@click="register"
				@keydown.enter="register"
				round>
				注册
			</el-button>
		</form>
	</div>
</template>
<script>
	import Logo from "../components/Logo.vue";
	import { mapGetters, mapActions } from "vuex";
	import { Login, Register, sendEmail } from "../api/login.js";
	export default {
		name: "LoginCard",
		components: {
			Logo,
		},
		data() {
			return {
				status: true,
				rememberMe: false,
				Loginform: {
					username: "",
					password: "",
				},
				Registerform: {
					username: "",
					password: "",
					email: "",
					code: "",
				},
				activeTab: "login",
				ifLogin: true,
				showPassword: false,
				iconColor: "red",
			};
		},
		computed: {
			inputType() {
				return this.showPassword ? "text" : "password";
			},
		},
		methods: {
			...mapActions(["setId"]),
			Logins() {
				console.log("触发登录时间");
				Login(this.Loginform)
					.then((res) => {
						console.log("触发登录时间1");
						const token = "Bears " + res.data.access_token;
						sessionStorage.setItem("token", token);
						sessionStorage.setItem("userId", res.data.user.id);
						sessionStorage.setItem("userIdentity", res.data.user.identity);
						// 子组件中
						this.setId(res.data.user.identity);
						this.$router.push("/upload");
					})
					.catch((error) => {
						// 处理错误
						console.error(error.response.data.error);
						this.$message({
							type: "error",
							message: error.response.data.error,
						});
					});
			},
			toggleInputType() {
				this.showPassword = !this.showPassword;
			},
			changeTab(tab) {
				this.activeTab = tab;
				this.ifLogin = !this.ifLogin;
			},
			sendCode() {
				console.log(this.Registerform);
				sendEmail(this.Registerform.code)
					.then((res) => {
						this.$message({
							type: "success",
							message: "发送成功",
						});
					})
					.catch((error) => {
						// 处理错误
						console.error(error);
						this.$message({
							type: "success",
							message: error,
						});
					});
			},
			register() {
				Register(this.Registerform)
					.then((res) => {
						this.$message({
							type: "success",
							message: "创建成功",
						});
						Login(this.Registerform).then((res) => {
							console.log("触发登录时间1");
							var token = "Bears " + res.data.access_token;
							sessionStorage.setItem("token", token);
							sessionStorage.setItem("userId", res.data.user.id);

							// 子组件中
							this.setId(res.data.user.identity);

							console.log("identify", res.data.user.identity);
							this.$router.push("/upload");
						});
					})
					.catch((error) => {
						// 处理错误
						console.error(error);
						this.$message({
							type: "error",
							message: error.response.data.error,
						});
					});
			},
		},
	};
</script>
<style scoped>
	.pad {
		margin-left: 47px;
	}

	.Afont {
		font-size: larger;
		letter-spacing: 2px;
		position: relative;
		cursor: pointer;
	}
	.reg {
		background-color: #252727;
		color: #fff;
	}
	.Afont::after {
		content: "";
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 0;
		height: 2px;
		background-color: blue;
		/* 这里可以根据您的需要更改下划线的颜色 */
		transition: width 0.3s ease-in-out;
	}

	.active::after {
		width: 100%;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background-color: #ffffff;
		padding: 30px;
		width: 400px;
		border-radius: 20px;
		margin-top: 23px;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
			Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}

	.outer_in {
		height: 88vh;
	}

	.change {
		display: flex;
		text-align: center;
		justify-content: center;
		padding-top: 15%;
	}

	::placeholder {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
			Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}

	.form button {
		align-self: flex-end;
	}

	.flex-column > label {
		color: #151717;
		font-weight: 600;
	}

	.inputForm {
		border: 1.5px solid #ecedec;
		border-radius: 10px;
		height: 50px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		transition: 0.2s ease-in-out;
	}

	.input {
		margin-left: 10px;
		border-radius: 10px;
		border: none;
		width: 85%;
		height: 100%;
	}

	.input:focus {
		outline: none;
	}

	.inputForm:focus-within {
		border: 1.5px solid #2d79f3;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		justify-content: space-between;
	}

	.flex-row > div > label {
		font-size: 14px;
		color: black;
		font-weight: 400;
	}

	.span {
		font-size: 14px;
		margin-left: 5px;
		color: #2d79f3;
		font-weight: 500;
		cursor: pointer;
	}

	.button-submit {
		margin: 20px 0 10px 0;
		background-color: #151717;
		border: none;
		color: white;
		font-size: 15px;
		font-weight: 500;
		border-radius: 10px;
		height: 50px;
		width: 100%;
		cursor: pointer;
	}

	.button-submit:hover {
		background-color: #252727;
	}

	.p {
		text-align: center;
		color: black;
		font-size: 14px;
		margin: 5px 0;
	}

	.btn {
		margin-top: 10px;
		width: 100%;
		height: 50px;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		gap: 10px;
		border: 1px solid #ededef;
		background-color: white;
		cursor: pointer;
		transition: 0.2s ease-in-out;
	}

	.btn:hover {
		border: 1px solid #2d79f3;
	}

	.code {
		width: 55%;
	}

	.Rform {
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
	}

	.code-outer {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 8.5%;
	}

	.ecode {
		width: 18%;
		text-align: center;
		margin-left: 5%;
	}

	.labels {
		margin-top: 8.5%;
		width: 100%;
	}

	.labinner {
		width: 77%;
		color: #252727;
	}

	.labels:hover {
		border: #252727;
	}

	.reg {
		margin-top: 8.5%;
		width: 77.6982526%;
	}

	::v-deep input::-webkit-input-placeholder {
		color: #252727;
	}
</style>
<style>
	::v-deep .el-input__prefix {
		color: #252727 !important;
	}
</style>
