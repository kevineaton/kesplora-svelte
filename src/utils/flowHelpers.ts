

export const processFlow = (flow: any[], asArray: boolean = false) => {
    const flowMap: any = {};
    // we iterate over and group them into modules with blocks, and try to keep track of the status
    let currentModuleId = 0;
    let currentModuleStatus = "not_started";
    flow.forEach((block: any, index: number) => {
      // if the new block module id differs, set up the next block
      if(block.moduleId !== currentModuleId){
        // set the status and build the map, move on to the next one
        if(index != 0){
          flowMap[flow[index - 1].moduleId].status = currentModuleStatus;
        }
        currentModuleStatus = "not_started"
        flowMap[block.moduleId] = {
          blocks: [],
          name: block.moduleName,
          description: block.moduleDescription,
          status: "not_started",
          active: false,
        }
        currentModuleId = block.moduleId;
      }
      if(block.userStatus !== currentModuleStatus){
        currentModuleStatus = block.userStatus;
      }
      block.id = block.blockId; // the flow uses a different id than an individual block call
      flowMap[block.moduleId].blocks.push(block);

      // if this is the last one, we need to close out the module status
      if(index === flow.length - 1){
        flowMap[block.moduleId].status = currentModuleStatus;
      }
    })
    if(!asArray){
      return flowMap;
    }
    const ar: any[] = [];
    Object.keys(flowMap).forEach((moduleId) => {
      flowMap[moduleId].moduleId = parseInt(moduleId);
      ar.push(flowMap[moduleId])
    });
    return ar;
  }