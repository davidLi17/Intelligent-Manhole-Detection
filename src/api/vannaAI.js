import vanna from "./vindex.js";

// 上传问题生成SQL查询
export const uploadQuestion = (question) => {
    return vanna({
        url: '/generate_sql?question='+question,
        method: 'get',

        
    })
}
// 运行SQL查询并生成图表
export const runSql = (id) => {
    return vanna({
        url: '/run_sql?id='+id,
        method: 'get',

        
    })
}

// 生成Plotly图表
export const generatePlotlyChart = (id) => {
    return vanna({
        url: '/generate_plotly_figure?id='+ id +'&chartInstructions=柱状图的图表',
        method: 'get',

        
    })
}

// 生成AI结果
export const generateResByAI = (id) => {
    return vanna({
        url: '/generate_summary?id='+id,
        method: 'get',
    })
}

