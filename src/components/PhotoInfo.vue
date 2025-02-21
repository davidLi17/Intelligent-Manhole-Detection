<template>
    <div class="modal">
        <form class="form">
            <div class="payment--options">
            </div>
            <div class="separator">
                <hr class="line" style="font-size: 20px;">
                <p>井盖信息</p>
                <hr class="line">
            </div>
            <div class="credit-card-info--form">
                <div class="input_container">
                    <label for="1" class="input_label">拍摄时间</label>
                    <input id="1" v-model="record_form.date" class="input_field" type="text" name="input-time"
                        title="拍摄时间" placeholder="请输入照片拍摄时间">
                </div>
                <div class="input_container">
                    <label for="2" class="input_label">
                        拍摄地点
                        <el-button type="text" @click="dialogVisible = true">（点击此处选择地点）</el-button>
                    </label>
                    <input id="2" v-model="record_form.address" class="input_field" type="text" name="input-address"
                        title="拍摄地点" placeholder="请输入照片拍摄地点">
                </div>
                <div class="input_container">
                    <label for="3" class="input_label">备注</label>
                    <input id="3" v-model="record_form.info" class="input_field" type="text" name="input-info"
                        title="备注" placeholder="可在此处填写备注信息">
                </div>
            </div>
            <button class="purchase--btn" @click.prevent.stop="submitRecord">添加记录</button>
        </form>
        <el-dialog title="地图" :visible.sync="dialogVisible" >
            <span>当前选择位置：{{ location.lng }},{{ location.lat }}</span>
            <div class="map-container">
                <amap @updateLocation="getLocation" width="800" height="500"></amap>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

import { AddToHistory } from "../api/history.js";
import amap from "../components/amap.vue"
export default {
    name: 'PhotoInfo',
    props: ['index'],
    components: {
        amap,
    },
    data() {
        return {
            location: {
                lng: 0,
                lat: 0,
            },
            record_form: {
                date: '',
                address: '',
                info: '',
                lng: 0,
                lat: 0 
            },
            dialogVisible: false,
        }
    },
    methods: {
        getLocation(lng, lat, searchKey) {
            console.log(lng, lat, searchKey)
            this.location.lng = lng;
            this.location.lat = lat;
            // this.record_form.address = searchKey + '['+lng+','+ lat +']'
            this.record_form.address = searchKey
            this.record_form.lng = lng;
            this.record_form.lat = lat;
        },
        submitRecord() {
            console.log(this.record_form)
            let form = this.record_form;

            AddToHistory(form)
                .then((response) => {

                    if (response.data.success == "添加成功") {
                        // console.log(response.data.history.id);
                        this.$emit('getRecordId', response.data.history.id)
                        this.$message({
                            message: "添加成功！",
                            type: 'success',
                            center: true,
                        });

                    } else {
                        this.$message({
                            message: "添加失败！",
                            type: 'warning',
                            center: true,
                        });

                    }
                })
        },
        

    },
}
</script>
<style scoped>
.modal {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    /* box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1); */
    box-shadow: 2px 2px 4px #d1d9e6, -2px -2px 4px #d1d9e6;
    border-radius: 26px;


}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.payment--options {
    width: calc(100% - 40px);
    display: grid;
    grid-template-columns: 33% 34% 33%;
    gap: 20px;
    padding: 10px;
}

.payment--options button {
    height: 55px;
    background: #F2F2F2;
    border-radius: 11px;
    padding: 0;
    border: 0;
    outline: none;

}

.payment--options button svg {
    height: 18px;
}

.payment--options button:last-child svg {
    height: 22px;
}

.separator {
    width: calc(100% - 20px);
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 10px;
    color: #8B8E98;
    margin: 0 10px;
}

.separator>p {
    word-break: keep-all;
    display: block;
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    margin: auto;
}

.separator .line {
    display: inline-block;
    width: 100%;
    height: 1px;
    border: 0;
    background-color: #e8e8e8;
    margin: auto;
}

.credit-card-info--form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input_container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
}



.input_label {
    text-align: left;
    font-size: 15px;
    color: #8B8E98;
    font-weight: 600;
}

.input_field {
    width: auto;
    height: 40px;
    padding: 0 0 0 16px;
    border-radius: 9px;
    outline: none;
    background-color: #F2F2F2;
    border: 1px solid #e5e5e500;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.input_field:focus {
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 2px #242424;
    background-color: transparent;
}

.purchase--btn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 55px;
    bottom: 5%;
    width: 70%;
    background: #0b3fe9;
    border-radius: 11px;
    border: 0;
    outline: none;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    /* background: linear-gradient(180deg, #363636 0%, #1B1B1B 50%, #000000 100%); */
    box-shadow: 0px 0px 0px 0px #FFFFFF, 0px 0px 0px 0px #000000;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.purchase--btn:hover {
    box-shadow: 0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #0000003a;

}

/* Reset input number styles */
.input_field::-webkit-outer-spin-button,
.input_field::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.input_field[type=number] {
    -moz-appearance: textfield;
}

::v-deep .el-dialog {
  height: 720px;
  overflow: auto;
}

.dialog-box {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.map-container {
    
    width: 800px;
    height: 500px;
    margin: auto;
    
}
</style>