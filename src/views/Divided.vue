<template>
    <div class="container-note">
        <div class="outerbox">
            <el-table ref="filterTable" :data="currentPageData" style="width: 85%;flex:0.83;">
                <el-table-column prop="updatedAt" label="日期" sortable width="180">
                </el-table-column>
                <el-table-column prop="prediction" label="损坏类型" width="180">
                </el-table-column>
                <el-table-column prop="location" label="地址" :formatter="formatter">
                </el-table-column>
                <el-table-column prop="repairer" label="维修人员" width="150" :filters="[{ text: '未分配', value: '未分配' }]"
                    :filter-method="filterTag" filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.repairer === '未分配' ? 'primary' : 'success'"
                            @click="isdivided(scope.row)" id="but" disable-transitions>{{ scope.row.repairer }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagedivided">
                <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
                    :total=arrayList.length :page-size=itemsPerPage>
                </el-pagination>
            </div>
            <el-dialog :visible.sync="isDisplay" title="任务分配" append-to-body style="width: 100%;">

                <el-table id="people" :data="UcurrentPageData" style="width: 95%;margin-left:3%">
                    <el-table-column label="姓名" width="150" prop="name">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" width="180">
                    </el-table-column>
                    <el-table-column prop="identity" label="人员" width="120">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">分配</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div class="Upagedivided">
                    <el-pagination background layout="prev, pager, next" @current-change="UhandleCurrentChange"
                        :total=UarrayList.length :page-size=UitemsPerPage>
                    </el-pagination>
                </div>
            </el-dialog>
            
            <!-- 新的编辑弹窗 -->
            <el-dialog :visible.sync="editDialogVisible" title="编辑信息">
                <el-form :model="editForm">
                    <el-form-item label="损坏类型">
                        <el-input v-model="editForm.prediction"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="editForm.location"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveEdit">保存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { ShowHistory } from '../api/history.js';
import { getAllUser, historiesAssign } from '@/api/usermangerment.js';
export default {
    data() {
        return {
            arrayList: [],
            isDisplay: false,
            currentPage: 1, // 当前页码
            itemsPerPage: 6, // 每页显示的条目数
            ifSort: false,
            currentPageData: [], // 当前页显示的数据
            id: '',
            UarrayList: [],
            UcurrentPage: 1, // 当前页码
            UitemsPerPage: 15, // 每页显示的条目数
            UcurrentPageData: [], // 当前页显示的数据,
            editDialogVisible: false,
            editForm: {
                id: '',
                prediction: '',
                location: '',
            },
            predictionMap: {
                "good": "井盖完好",
                "broke": "井盖破损",
                "lose": "井盖丢失",
                "uncovered": "井盖未盖",
                "circle": "井圈有问题",
            },
        }
    },
    methods: {
        saveEdit() {
            
        },
        handleEdit(index, row) {
            console.log(index, row);
            historiesAssign(this.id, row.id)
                .then((res) => {
                    console.log(res);
                    this.$message({
                        type: 'success',
                        message: '分配成功'
                    });
                    this.isDisplay = false;
                    ShowHistory()
                        .then((res) => {

                            this.arrayList = res.data.histories;

                            for (var i = 0; i < this.arrayList.length; i++) {
                                var timestamp = this.arrayList[i].updatedAt;
                                var date = new Date(timestamp);
                                var year = date.getFullYear();
                                var month = date.getMonth() + 1; // 月份从0开始，需要加1
                                var day = date.getDate();
                                this.arrayList[i].updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
                            }
                            console.log(this.arrayList);
                            this.currentPageData = this.arrayList.slice(0, 6);
                            this.currentPage = 0;
                        })
                        .catch(error => {
                            // 处理错误
                            console.error(error);
                        });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        UhandleCurrentChange(page) {
            // 当前页码变化时的处理逻辑
            this.UcurrentPage = page;
            var start = (page - 1) * 15;
            var end = page * 15;
            this.UcurrentPageData = this.UarrayList.slice(start, end);
        },
        Todividede(id) {
            this.id = id;
            getAllUser()
                .then((res) => {
                    this.UarrayList = res.data.allUser;
                    this.UarrayList = this.UarrayList.filter(obj => obj.identity === "repairer").map(obj => {
                        obj.identity = "维修人员";
                        return obj;
                    });
                    this.UcurrentPageData = this.UarrayList.slice(0, 15);
                    console.log(this.UarrayList);

                })
                .catch((err) => {
                    console.log(err);
                })
            console.log("我方法呢？");
            this.isDisplay = true

        },
        isdivided(e) {
            // if(e == '未分配') return Todividede
            console.log("信息是", e);
            if (e.repairer === '未分配') this.Todividede(e.id)
            else {
                this.$message({
                    type: 'warning',
                    message: '已分配'
                });
            }
        },
        openEditDialog(row) {
            this.editForm = { ...row };
            this.editDialogVisible = true;
        },
        resetDateFilter() {
            this.$refs.filterTable.clearFilter('date');
        },
        clearFilter() {
            this.$refs.filterTable.clearFilter();
        },
        formatter(row, column) {
            return row.location;
        },
        filterTag(value, row) {
            return row.repairer === value;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        handleCurrentChange(page) {
            // 当前页码变化时的处理逻辑
            this.currentPage = page;
            var start = (page - 1) * 6;
            var end = page * 6;
            this.currentPageData = this.arrayList.slice(start, end);
            if (this.currentPageData.length % 2 == 1) {

                const newObj = { id: "err", ifFake: false };
                this.currentPageData.push(newObj);
            }
            console.log("aaa", this.currentPageData);
        },
    },
    created() {
        console.log(localStorage.getItem('token'));
        ShowHistory()
            .then((res) => {

                this.arrayList = res.data.histories;

                for (var i = 0; i < this.arrayList.length; i++) {
                    var timestamp = this.arrayList[i].updatedAt;
                    var date = new Date(timestamp);
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1; // 月份从0开始，需要加1
                    var day = date.getDate();
                    this.arrayList[i].updatedAt = year + "-" + month + "-" + day;; // 更改每个对象的时间戳字段
                }
                console.log(this.arrayList);
                this.currentPageData = this.arrayList.slice(0, 6);
            })
            .catch(error => {
                // 处理错误
                console.error(error);
            });
    },
}
</script>
<style scoped>
.container-note {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    background-color: #f8f9fa;
    /* background-color: #ecf0f3;*/
}

.outerbox {
    width: 100%;
    height: 82%;
    border-radius: .75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 5px;
}

.pagedivided {
    margin-right: 15%;
    margin-top: 8px;

}

.Upagedivided {
    margin-top: 8px;
    margin-left: 80%;
}

#but {
    cursor: pointer;
}
</style>