<template>
    <div class="container-note">
        <div class="top">
            <div class="sort" :class="{ active: isActive }" @click="sorts"> <svg data-v-a4e76a79="" fill="none"
                    viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg" alt="Toggle filters">
                    <path xmlns="http://www.w3.org/2000/svg" d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"
                        fill="#5C6067"></path>
                </svg></div>
            <div class="search">
                <div class="search_input">
                    <el-select v-model="value" placeholder="请选择状态" size="small" clearable class="chocie">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                    <el-input v-model="sdata" placeholder="请输入日期(格式为年-月-日)" style="width:30%;height:100%"
                        size="small"></el-input>
                    <el-input v-model="slocation" placeholder="请输入地点" style="width:30%;height:100%"
                        size="small"></el-input>
                </div>
                <div class="operation">
                    <el-button type="primary" icon="el-icon-search" class="but" size="small"
                        @click="Tosearch"></el-button>
                    <el-button type="primary" icon="el-icon-delete" class="but" size="small" @click="clear"></el-button>
                </div>
                <div class="AI">
                    <button class="button2" @click="openAll"><i class="el-icon-more-outline"></i></button>
                </div>
            </div>
        </div>
        <div class="note-list"
            :class="{ 'note-list': currentPageData.length >= 6, 'less-note-list': currentPageData.length < 6 }">
            <div class="outer" v-for="(item, index) in currentPageData" @click="Detial(item.id)">
                <div class="left">
                    <div class="title">{{ item.updatedAt }}</div>

                    <div class="content">{{ item.location }}</div>
                    <div class="bottom">
                        <div class="guess">{{ item.prediction }}</div>
                        <div
                            :class="{ 'repaired': item.damageType === '已维修', 'norepaired': item.damageType === '待维修' }">
                            {{ item.damageType }}</div>
                    </div>
                </div>
                <div class="right">
                    <img :src=item.predictedUrl alt="">
                </div>
            </div>


        </div>
        <div class="footers">
            <div class="steps" v-if="stepshow">
                <el-steps :active="active" finish-status="success">
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2"></el-step>
                    <el-step title="步骤 3"></el-step>
                </el-steps>
            </div>
            <div class="pagedivided">
                <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
                    :total=totalPages :page-size="6">
                </el-pagination>

            </div>
        </div>

        <div v-if="dialogVisible" class="overlay" @click="dialogVisible = false"></div>
        <div v-if="dialogVisible" class="dialog">
            <div class="dialog-content">
                <span class="close" @click="dialogVisible = false">&times;</span>
                <h2>AI快捷服务</h2>
                <div class="messages">
                    <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
                        <div v-if="message.sender == 'photoB'" class="heads"> <img src="https://www.chatmee.cn/wdd.svg"
                                alt=""></div>
                        <div class="heads" v-else-if="message.sender == 'photoU'"><img
                                src="https://images.meisa.dev/2024/04/13/5102a5fce70dde96425b0725f35d7a40.svg" alt="">
                        </div>
                        <p v-else>{{ message.text }}</p>
                    </div>
                </div>
                <div class="Aioperation">
                    <input v-model="userInput" @keyup.enter="sendMessage" placeholder="输入你的消息" />
                    <button class="dbut" @click="sendMessage">发送</button>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import { ShowHistory, getRecordById, getRecordByRepairer } from '../api/history.js';
import Plotly from "plotly.js-dist";
import { mapGetters, mapActions } from 'vuex';
import { uploadQuestion, runSql, generatePlotlyChart, generateResByAI } from "../api/vannaAI";
// import "../../public/font/NotoSansHK.css"
export default {

    data() {
        return {
            data: [], // 完整的数据列表
            currentPage: 1, // 当前页码
            itemsPerPage: 6, // 每页显示的条目数
            totalPages: 0, // 总页数
            ifSort: false,
            sdata: '',
            slocation: '',
            currentPageData: [], // 当前页显示的数据
            currentData: [],
            options: [{
                value: '选项1',
                label: '已维修'
            }, {
                value: '选项2',
                label: '待维修'
            }],
            value: '',
            note_list: [
                {
                    updatedAt: "2024-03-20T13:55:51.144Z",
                    imgUrl: require("@/assets/ManholeCover_Picture/well3_0062.jpg"),
                    damageType: "严重破损",
                    repairer: "未维护",
                    location: "桂林电子科技大学花江校区宿舍A区",
                    info: ""
                },
                {
                    updatedAt: "2024-03-20T13:55:51.144Z",
                    imgUrl: require("@/assets/ManholeCover_Picture/well3_0063.jpg"),
                    damageType: "部分缺失",
                    repairer: "未维护",
                    location: "桂林电子科技大学花江校区宿舍B区",
                    info: ""
                },
            ],
            arrayList: [],
            isActive: false,
            dialogVisible: false,
            newtip: '最近解决路障',
            Need: '',
            isLoading: false,
            userInput: '',
            response: '',
            messages: [],
            stepshow: false,
            active: 1,
        }
    },
    methods: {
        ...mapActions(['updateScatterData']),
        updateData(newData) {
            this.updateScatterData(newData);
        },
        ...mapActions(['updateMsg']),
        upMsg(newData){
            this.updateMsg(newData);
        },
        Detial(id) {
            console.log(id);
            this.$router.push(`/detial/${id}`)
        },
        clear() {
            this.value = ''
            this.sdata = ''
            this.slocation = ''
            this.totalPages = this.arrayList.length
            this.currentData = this.arrayList
            this.currentPageData = this.arrayList.slice(0, 6);
        },
        resetDialog() {
            this.userInput = '';
            this.response = '';
        },
        Tosearch() {
            this.sleep(3000)
            console.log(this.value);
            this.currentPageData = this.arrayList.filter(item => {
                if (this.value && this.slocation && this.sdata) {
                    return item.damageType === this.value && item.location.includes(this.slocation) && item.updatedAt === this.sdata;
                } else if (this.value && this.slocation) {
                    return item.damageType === this.value && item.location.includes(this.slocation);
                } else if (this.value && this.sdata) {
                    return item.damageType === this.value && item.updatedAt === this.sdata;
                } else if (this.slocation && this.sdata) {
                    return item.location.includes(this.slocation) && item.updatedAt === this.sdata;
                } else if (this.value) {
                    return item.damageType === this.value;
                } else if (this.slocation) {
                    return item.location.includes(this.slocation);
                } else if (this.sdata) {
                    return item.updatedAt === this.sdata;
                } else {
                    return true;
                }
            });
            this.totalPages = this.currentPageData.length
            this.currentData = this.currentPageData
            this.currentPageData = this.currentData.slice(0, 6);
        },
        scrollToBottom() {
            const container = this.$el.querySelector('.messages');
            container.scrollTop = container.scrollHeight;
        },
        sorts() {
            if (this.ifSort) {
                this.arrayList.sort((a, b) => {
                    const timeA = new Date(a.updatedAt);
                    const timeB = new Date(b.updatedAt);
                    return timeA - timeB;
                });
            }

            else {
                this.arrayList.sort((a, b) => {
                    const timeA = new Date(a.updatedAt);
                    const timeB = new Date(b.updatedAt);
                    return timeB - timeA;
                });
            }
            console.log(this.arrayList);
            this.handleCurrentChange(1);
            this.ifSort = !this.ifSort;
            this.isActive = !this.isActive
        },
        handleCurrentChange(page) {
            // 当前页码变化时的处理逻辑
            this.currentPage = page;
            var start = (page - 1) * 6;
            var end = page * 6;
            this.currentPageData = this.currentData.slice(start, end);

        },
        getmes() {
            const tipsText = this.$refs.tips.innerText;
            this.Need = tipsText
        },
        addMessage(identifiy, content) {
            this.messages.push({ sender: identifiy, text: content });
        },
        sendMessage() {
            let input = this.userInput;
            this.userInput = '';
            this.active = 1
            let id
            if (input.trim() !== '') {
                this.addMessage('photoU', "")
                this.addMessage('user', input.trim())
                setTimeout(() => {
                    this.addMessage('photoB', "")
                    this.addMessage('bot', "正在处理您的请求...")
                }, 50);
                uploadQuestion(input.trim())
                    .then((res) => {
                        let draw;
                        const ans = res
                        console.log(ans);
                        console.log("nmsl", this.messages);
                        id = ans.id
                        runSql(id)
                            .then((res) => {
                                console.log("runsql", res);
                                draw = res.should_generate_chart
                                generateResByAI(id)
                                    .then((res) => {
                                        this.addMessage('bot', "AI分析" + res.text)
                                        this.updateMsg(this.messages)
                                        if (input.includes('图') || draw) {
                                            generatePlotlyChart(id)
                                                .then((res) => {
                                                    console.log("图标", JSON.parse(res.fig));
                                                    let temp = JSON.parse(res.fig)
                                                    setTimeout(() => {
                                                        this.updateData(temp.data)
                                                        if (temp.data[0].type != 'bar') this.addMessage('bot', "缺少数据，无法生成")
                                                        else {
                                                            this.addMessage('bot', "生成成功，进行跳转")
                                                            setTimeout(() => {
                                                                this.$router.push('/trends')
                                                            },500)
                                                        }
                                                    }, 1000);

                                                })
                                        }
                                    })

                            })

                    })
                // 模拟机器人回复
            }



            // this.stepshow = true
            // this.incrementActive();
            // this.dialogVisible = false

        },
        openAll() {
            this.dialogVisible = true
            this.stepshow = false
            this.messages = this.getMsg
        },
        incrementActive() {
            if (this.active <= 3) {
                const delay = Math.random() * 2500; // 0-2 秒随机数
                this.timer = setTimeout(() => {
                    this.active++;
                    this.incrementActive();
                }, delay);
            } else {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },

    },
    watch: {
        messages() {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        }
    },
    computed: {
        ...mapGetters(['getId']),
        ...mapGetters(['getMsg']),
    },
    created() {
        console.log(localStorage.getItem('token'));
        
        console.log("sb2",this.messages);
        if (this.getId == 'admin') {
            ShowHistory()
                .then((res) => {
                    console.log("admin");
                    this.arrayList = res.data.histories;

                    for (var i = 0; i < this.arrayList.length; i++) {
                        var timestamp = this.arrayList[i].updatedAt;
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1; // 月份从0开始，需要加1
                        var day = date.getDate();
                        this.arrayList[i].updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
                    }
                    const predictionMap = {
                        "good": "井盖完好",
                        "broke": "井盖破损",
                        "lose": "井盖丢失",
                        "uncovered": "井盖未盖",
                        "circle": "井圈有问题",
                        "potholes": "坑洼",
                        "Transverse": "横向裂缝",
                        "Longitudinal": "纵向裂缝",
                        "Crocodile": "鳄鱼状裂缝",

                    };

                    this.arrayList.forEach(history => {
                        if (history.prediction in predictionMap) {
                            history.prediction = predictionMap[history.prediction];
                        }
                    });
                    console.log(this.arrayList);
                    this.currentData = this.arrayList
                    this.currentPageData = this.currentData.slice(0, 6);
                    this.totalPages = this.arrayList.length
                })
                .catch(error => {
                    // 处理错误
                    console.error(error);
                });
        }
        else if (this.getId == 'checker') {
            console.log("checker");
            console.log(localStorage.getItem('userId'));
            var id = localStorage.getItem('userId')
            getRecordById(id)
                .then((res) => {
                    console.log("我真的是检查", res);
                    console.log(this.arrayList);
                    this.arrayList = res.data.histories;

                    for (var i = 0; i < this.arrayList.length; i++) {
                        var timestamp = this.arrayList[i].updatedAt;
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1; // 月份从0开始，需要加1
                        var day = date.getDate();
                        this.arrayList[i].updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
                    }
                    const predictionMap = {
                        "good": "井盖完好",
                        "broke": "井盖破损",
                        "lose": "井盖丢失",
                        "uncovered": "井盖未盖",
                        "circle": "井圈有问题",

                    };

                    this.arrayList.forEach(history => {
                        if (history.prediction in predictionMap) {
                            history.prediction = predictionMap[history.prediction];
                        }
                    });
                    console.log("checker", this.arrayList);
                    this.currentData = this.arrayList
                    this.currentPageData = this.currentData.slice(0, 6);
                    this.totalPages = this.arrayList.length
                })
                .catch(error => {
                    // 处理错误
                    console.error(error);
                });
        }
        else {
            getRecordByRepairer()
                .then((res) => {
                    this.arrayList = res.data.histories;
                    console.log("rper");
                    for (var i = 0; i < this.arrayList.length; i++) {
                        var timestamp = this.arrayList[i].updatedAt;
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1; // 月份从0开始，需要加1
                        var day = date.getDate();
                        this.arrayList[i].updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
                    }
                    const predictionMap = {
                        "good": "井盖完好",
                        "broke": "井盖破损",
                        "lose": "井盖丢失",
                        "uncovered": "井盖未盖",
                        "circle": "井圈有问题",

                    };

                    this.arrayList.forEach(history => {
                        if (history.prediction in predictionMap) {
                            history.prediction = predictionMap[history.prediction];
                        }
                    });
                    console.log(this.arrayList);
                    this.currentData = this.arrayList
                    this.currentPageData = this.currentData.slice(0, 6);
                    this.totalPages = this.arrayList.length
                })
                .catch(error => {
                    // 处理错误
                    console.error(error);
                });
        }
    },
}
</script>
<style>
.el-input__inner {
    height: 32px;
    line-height: 32px;
}
</style>
<style scoped>
.dialog-response {
    margin-top: 10px;
}

.el-dialog__wrapper {
    display: flex;
    justify-content: flex-end;
}

.el-dialog {
    margin-right: 1200px;
    /* 根据需要调整 */
}

.chocie {
    height: 32px;
    line-height: 32px;
}

.container-note {
    width: 100%;
    height: 100%;

    overflow: auto;


    background-color: #f8f9fa;
    /* background-color: #ecf0f3;*/
}

.note-list {
    /* border: 2px solid #00090f; */
    display: flex;
    width: 100%;
    margin-top: 32px;
    overflow: auto;

    justify-content: center;
    flex: 1;
    flex-wrap: wrap;

    align-content: center;
}

.less-note-list {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding-left: 4%;
    justify-content: flex-start;
    flex: 1;
    flex-wrap: wrap;

    align-content: flex-start;
}

.text-date {
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    color: rgb(11, 55, 136);
    font-weight: 600;
}

.text-address {
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px;
    color: rgb(147, 148, 150);
    font-weight: 300;
}

.text-type {
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50px;
    color: rgb(106, 22, 241);
    font-weight: 300;
}

.note-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 40%;
}
</style>
<style scoped>
.top {
    margin-left: 4%;
    width: 88%;
    height: 3%;
    box-sizing: border-box;
    display: flex;
    margin-top: 1.8%;
    justify-content: space-around;
}

.search {
    height: 73%;
    width: 88%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    margin-left: 25%;
}

.search_input {
    display: flex;
    justify-content: space-between;
}

.sort {
    width: 24px;
    height: 24px;

    cursor: pointer;

}

.outer {
    width: 46%;
    margin: 8px;
    height: 25vh;
    border-radius: .75rem;
    box-shadow: 2px 1px 7px 6px #0a113612;
    margin-right: 8px;
    display: flex;
    border: 2px solid transparent;
}

.outer:hover {
    border: 2px solid #111f68;

}

.left {
    width: 68%;
    height: 100%;
    box-sizing: border-box;

}

.right {
    width: 32%;
    height: 100%;
    border-radius: .75rem;
    padding: 10px;
    background-size: 100% 100%;
    box-sizing: border-box;
}

.pagedivided {
    float: right;
    margin-left: 15%;
}

img {

    width: calc(100% - .55rem);
    height: calc(100% - .55rem);

    margin: .375rem;
    border-radius: .375rem;
}

.title {
    width: 100%;
    height: 15%;
    text-align: left;
    font-size: 18px;
    padding-left: 7.3%;
    align-items: center;
    color: #111f68;
    padding-top: 5.4%;
    font-family: "Noto Sans CJK", sans-serif;
    letter-spacing: 0.06em;
}

.content {
    width: 88%;
    height: 35%;
    padding-top: 1.2%;

    font-family: "Noto Sans CJK", sans-serif;
    letter-spacing: 0.06em;
    padding-left: 7.3%;
    color: #111f68;
}

.bottom {
    padding-top: 3.8%;
    width: 100%;
    height: 30%;
    display: flex;
    padding-left: 7.3%;

}

.guess {
    color: #888;
    padding-top: 1.8%;
    letter-spacing: 0.06em;
    width: 20%;
    height: 50%;
    padding: 1px;
    border-radius: 1.125rem;
    text-overflow: ellipsis;
    background-color: #c2c2c233;
    font-size: small;
    justify-content: center;
    display: flex;
    align-items: center;
    /* 垂直居中 */
}

.repaired {

    display: flex;
    align-items: center;
    /* 垂直居中 */
    width: 20%;
    height: 50%;
    justify-content: center;
    padding: 1px;
    border-radius: 1.125rem;
    text-overflow: ellipsis;
    background-color: #e1f3d8;
    margin-left: 3.6%;
    color: #67c23a;
    font-size: small;

}

.active {
    background-color: #0f0e0e14;
    border-radius: .25em;
}

.norepaired {

    display: flex;
    align-items: center;
    /* 垂直居中 */
    width: 20%;
    height: 50%;
    justify-content: center;
    padding: 1px;
    border-radius: 1.125rem;
    text-overflow: ellipsis;
    background-color: #f56c6c;
    border-color: #f56c6c;
    margin-left: 3.6%;
    color: #fff;
    font-size: small;
}

.operation {
    width: 23%;
}

.AI {
    height: 100%;
}

.button2 {
    display: inline-block;
    transition: all 0.2s ease-in;
    position: relative;
    overflow: hidden;
    z-index: 1;
    color: #090909;
    padding: 0.7em 1.7em;
    cursor: pointer;
    font-size: 11px;
    border-radius: 0.5em;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
    box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;

}

.button2:active {
    color: #666;
    box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
}

.button2:before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%) scaleY(1) scaleX(1.25);
    top: 100%;
    width: 140%;
    height: 180%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
}

.button2:after {
    content: "";
    position: absolute;
    left: 55%;
    transform: translateX(-50%) scaleY(1) scaleX(1.45);
    top: 180%;
    width: 160%;
    height: 190%;
    background-color: #409EFF;
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
}

.button2:hover {
    color: #ffffff;
    border: 1px solid #409EFF;
}

.button2:hover:before {
    top: -35%;
    background-color: #409EFF;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.button2:hover:after {
    top: -45%;
    background-color: #409EFF;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.aitip {
    height: 10%;
    width: 100%;
    display: flex;
    margin-bottom: 0.9%;
}

.tips {
    border-radius: 0.5em;
    background: #ffffff;
    margin-left: 4.3%;
    color: #b5b5b5;
    cursor: pointer;
}

.dialog {
    position: fixed;
    top: 7%;
    right: 3%;
    width: 360px;
    height: 630px;
    background-color: rgb(255, 255, 255);
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    transition: transform 0.3s ease;
}

.dialog-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 243, 243, 0.5);
    z-index: 999;
    /* 遮罩层的层叠顺序 */
}

.messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
    max-height: calc(100% - 100px);
    /* 留出输入框和按钮的空间 */
}

.message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    font-size: small;
    word-wrap: break-word;
    /* 强制换行 */
}

.user {
    background-color: #e0f7fa;
    align-self: flex-end;
}

.heads {
    background-color: #fff;
    align-self: flex-end;
}

img {
    width: 18px;
    height: 18px;
}

.bot {
    background-color: #ffe0b2;
    align-self: flex-start;
}

input {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    /* 确保宽度包括内边距和边框 */
    width: 78%;
}

.dbut {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 20%;
    height: 37px;
    margin-left: 5px;
}

.dbut:hover {
    background-color: #0056b3;
}

.Aioperation {
    display: flex;
    width: 100%;
    height: 47px;
    margin-bottom: 30px;
}

.footers {
    width: 100%;
    display: flex;
}

.steps {
    width: 43%;
    height: 20px;
    margin-left: 3%;
}
</style>