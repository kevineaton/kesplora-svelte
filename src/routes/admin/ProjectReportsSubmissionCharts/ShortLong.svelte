<script type="ts">
  import { onMount } from "svelte";
  import { Collapse, Modal, ModalBody, ModalFooter, ModalHeader, TabContent, TabPane } from "sveltestrap";
  import { Card } from "../../../structure";
  import { wordFrequency } from "../../../utils";

  export let data = null;
  export let type: "short" | "long" = "short";

  const truncLimit = 20;

  let loading = true;
  let top: any[] = [];
  let frequency = [];
  let topFrequency: any[] = [];
  let showAllResponsesModal = false;
  let showAllFrequencyModal = false;
  let isOpenMap = {};
  let isOpenInModalMap = {};

  

  onMount(() => {
    for(let i = 0; i < 100; i++){
      if(type === "long"){
        data.responses.push({textResponse: "This is a rather long string that represents some interesting data for a user.\nThey may have typed in several 'things'. However, do not be distraught byt the length of the text since we should be doing things like collapsing after a certain length. But who knows? Maybe we don't.<strong>SMILE</strong>"})
      }else {
        data.responses.push({textResponse: "" + i})
      }
    }
    top = data.responses.slice(0, 4);
    let all = "";
    data.responses.forEach((response) => {
      all += " " + response.textResponse;
    });
    frequency = wordFrequency(all);
    topFrequency = frequency.slice(0, 4);
    data = data;
    loading = false;
  })

  const toggleShowAllResponsesModal = () => {
    showAllResponsesModal = !showAllResponsesModal;
  }

  const toggleShowAllFrequencyModal = () => {
    showAllFrequencyModal = !showAllFrequencyModal;
  }

  const expandLongResponse = (index: number, inModal: boolean = false) => {
    if(inModal){
      isOpenInModalMap[index] ? isOpenInModalMap[index] = !isOpenInModalMap[index] : isOpenInModalMap[index] = true;
    }else{
      isOpenMap[index] ? isOpenMap[index] = !isOpenMap[index] : isOpenMap[index] = true;
    }
  }
</script>

<div class="short-row-container">
  <Card {loading} title={data && data.questionText ? data.questionText : "Loading..."}>
    <TabContent>

      <TabPane tabId="top" tab="First Responses" active>
        <h2>First Responses</h2>
        <div class="row">
          <div class="col-1">
            #
          </div>
          <div class="col-11">
            Response
          </div>
        </div>
        {#each top as response, index}
          <div class="row">
            <div class="col-1">
              {index}:
            </div>
            {#if type === "long"}
              <div class="col-11">
                <div class="row">
                  <div class="col-11">
                    {response.textResponse.length > truncLimit ? response.textResponse.substring(0, truncLimit) + "..." : response.textResponse}
                    <Collapse isOpen={isOpenMap[index]}>
                      {response.textResponse}
                    </Collapse>
                  </div>
                  <div class="col-1">
                    <button on:click={() => expandLongResponse(index, false)}>X</button>
                  </div>
                </div>
              </div>
            {:else}
              <div class="col-11">
                {response.textResponse}
              </div>
            {/if}
          </div>
        {/each}
        <div class="row">
          <div class="col-12">
            <button class="btn btn-block btn-primary" on:click={toggleShowAllResponsesModal}>See All</button>
          </div>
        </div>
      </TabPane>

      <TabPane tabId="frequency" tab="Frequent Words">
        <h2>Most Frequent Words</h2>
        <div class="row">
          <div class="col-10">
            Word
          </div>
          <div class="col-2">
            Count
          </div>
        </div>
        {#each topFrequency as entry}
          <div class="row">
            <div class="col-10">
              {entry.word}
            </div>
            <div class="col-2">
              {entry.count}
            </div>
          </div>
        {/each}
        <div class="row">
          <div class="col-12">
            <button class="btn btn-block btn-primary" on:click={toggleShowAllFrequencyModal}>See All</button>
          </div>
        </div>
      </TabPane>

    </TabContent>


    <Modal isOpen={showAllResponsesModal} toggle={toggleShowAllResponsesModal} size="xl">
      <ModalHeader toggle={toggleShowAllResponsesModal}>All Responses</ModalHeader>
      <ModalBody>
        {#each data.responses as response, index}
          <div class="row">
            <div class="col-1">
              {index}:
            </div>
            {#if type === "long"}
              <div class="col-11">
                <div class="row">
                  <div class="col-11">
                    {response.textResponse.length > truncLimit ? response.textResponse.substring(0, truncLimit) + "..." : response.textResponse}
                    <Collapse isOpen={isOpenInModalMap[index]}>
                      {response.textResponse}
                    </Collapse>
                  </div>
                  <div class="col-1">
                    <button on:click={() => expandLongResponse(index, true)}>X</button>
                  </div>
                </div>
              </div>
            {:else}
              <div class="col-11">
                {response.textResponse}
              </div>
            {/if}
          </div>
        {/each}
      </ModalBody>
      <ModalFooter>
        <button class="btn btn-block btn-primary" on:click={toggleShowAllResponsesModal}>Done</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={showAllFrequencyModal} toggle={toggleShowAllFrequencyModal} size="xl">
      <ModalHeader toggle={toggleShowAllFrequencyModal}>All Words by Frequency</ModalHeader>
      <ModalBody>
        <div class="row">
          <div class="col-10">
            Word
          </div>
          <div class="col-2">
            Count
          </div>
        </div>
        {#each frequency as entry}
          <div class="row">
            <div class="col-10">
              {entry.word}
            </div>
            <div class="col-2">
              {entry.count}
            </div>
          </div>
        {/each}
      </ModalBody>
      <ModalFooter>
        <button class="btn btn-block btn-primary" on:click={toggleShowAllFrequencyModal}>Done</button>
      </ModalFooter>
    </Modal>
  </Card>
</div>