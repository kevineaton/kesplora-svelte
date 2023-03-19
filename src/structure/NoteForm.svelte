<script lang="ts">
  import { NotesAPI } from "../api";
  import { error, success } from "./Alert";
  import { flowStore, userStore } from "../stores";

  export let note: any = null;
  export let onSave: any = () => {};

  if(!note){
    note = {
      id: 0,
      userId: 0,
      createdOn: "",
      noteType: $flowStore && $flowStore.current.projectId && $flowStore.current.projectId !== 0 ? "project" : "journal",
      projectId: 0,
      module: 0,
      blockId: 0,
      visibility: "private",
      title: "",
      body: "",
    }
  }

  const saveNote = async () => {
    if(note.noteType === "journal"){
      note.projectId = 0;
      note.moduleId = 0;
      note.blockId = 0;
    } else if(note.id === 0){
      note.projectId = $flowStore.current.projectId;
      note.moduleId = $flowStore.current.moduleId;
      note.blockId = $flowStore.current.blockId;
    }
    try{
      if(note.id === 0){
        // create
        await NotesAPI.createNote($userStore.systemRole, note);
      } else {
        // update
        await NotesAPI.updateNote($userStore.systemRole, note.id, note);
      }
      onSave(note);
      success("Saved", "Note saved!");
    }catch(err){
      console.log(err);
      error("Uh oh!", "Could not save that note");
    }finally{

    }
  }

</script>

<div class="note-form-container">
  <div class="row">
    <div class="col-5">
      <div class="form-group">
        <label for="noteType">Note Type</label>
        <select class="form-control" bind:value={note.noteType}>
          <option value="journal">Journal</option>
          {#if $flowStore && $flowStore.current.projectId !== 0}
          <option value="project">Note Tied to a Project</option>
          {/if}
        </select>
      </div>
      {#if note.noteType === "project"}
        <div class="form-group">
          <label for="project">Project</label>
          <input id="project" type="text" class="form-control" disabled={true} value={$flowStore.current.projectName} />
        </div>
        <div class="form-group">
          <label for="module">Module</label>
          <input id="module" type="text" class="form-control" disabled={true} value={$flowStore.current.moduleName} />
        </div>
        <div class="form-group">
          <label for="block">Block</label>
          <input id="block" type="text" class="form-control" disabled={true} value={$flowStore.current.blockName} />
        </div>
      {/if}
      <div class="form-group">
        <label for="visibility">Visibility</label>
        <select class="form-control" bind:value={note.visibility}>
          <option value="private">Private</option>
          {#if $userStore.systemRole !== "admin"}
            <option value="admins">Freely Share with Admins</option>
          {/if}
        </select>
      </div>
    </div>
    <div class="col-7">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" bind:value={note.title} />
      </div>
      <div class="form-group">
        <label for="boty">Body</label>
        <textarea class="form-control" bind:value={note.body} rows={6} />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div class="form-group">
        <button class="btn btn-block btn-primary" on:click={saveNote}>Save Note</button>
      </div>
    </div>
  </div>
</div>