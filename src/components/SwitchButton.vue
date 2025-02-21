<template>
    <div class="container">
        <div class="tabs">
            <input type="radio" id="radio-1" name="tabs" checked="">
            <label class="tab" for="radio-1">原图</label>
            <input type="radio" id="radio-2" name="tabs">
            <label class="tab" for="radio-2">检测图</label>
            
            <span class="glider"></span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SwitchButton'
}
</script>

<style scoped>
.tabs {
    display: flex;
    position: relative;
    width: 200px;
    background-color: #fff;
    border: 10px #185ee0;
    box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
    padding: 0.75rem;
    border-radius: 99px;
    
}

.tabs * {
    z-index: 2;
}

.container input[type="radio"] {
    display: none;
}

.tab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 50%;
    font-size: .8rem;
    color: black;
    font-weight: 500;
    border-radius: 99px;
    cursor: pointer;
    transition: color 0.15s ease-in;
}

.notification {
    display: flex;
    align-items: center;
    justify-content: center;
    width: .8rem;
    height: .8rem;
    position: absolute;
    top: 10px;
    left: 30%;
    font-size: 10px;
    margin-left: 0.75rem;
    border-radius: 50%;
    margin: 0px;
    background-color: #e6eef9;
    transition: 0.15s ease-in;
}

.container input[type="radio"]:checked+label {
    color: #185ee0;
}

.container input[type="radio"]:checked+label>.notification {
    background-color: #185ee0;
    color: #fff;
    margin: 0px;
}

.container input[id="radio-1"]:checked~.glider {
    transform: translateX(11%);
}

.container input[id="radio-2"]:checked~.glider {
    transform: translateX(135%);
}


.glider {
    position: absolute;
    display: flex;
    height: 30px;
    width: 80px;
    background-color: #e6eef9;
    z-index: 1;
    border-radius: 99px;
    transition: 0.25s ease-out;
}

@media (max-width: 700px) {

    .tabs {
        transform: scale(0.6);
    }
}

</style>