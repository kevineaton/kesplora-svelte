<script lang="ts">
  import { h, html } from "gridjs";
  import Grid from "gridjs-svelte";
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { NotesAPI } from "../api";
  import { userStore } from "../stores";

  import { Card, error, Screen, success } from "../structure";
  import { capFirst, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT, translateDate } from "../utils";

  let loading = true;
  let allNotes: any[] = [];
  let filteredNotes: any[] = [];
  const role = $userStore.systemRole;
  
  let selectedNoteType: "journal" | "project" | "all" = "all";
  let selectedNote = null;
  let showNoteModal = false;
  let showDeleteModal = false;

  const cols = [
    {
      id: "noteType",
      name: "Type",
      formatter: (cell: any) => {
        return html(capFirst(cell))
      },
    },
    {
      id: "createdOn",
      name: "When",
      formatter: (cell: any) => {
        const display = translateDate(cell, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT);
        return html(display)
      }
    },
    {
      id: "title",
      name: "Title",
    },
    {
      id: "projectName",
      name: "Project",
    },
    {
      id: "moduleName",
      name: "Module",
    },
    {
      id: "blockName",
      name: "Block",
    },
    {
      id: "visibility",
      name: "Visibility",
    },
    {
      id: "actions",
      name: "Actions",
      formatter: (cell: any) => {
        return [
          h("i", {
            "class": "text-primary bi bi-eye icon-table text-link",
            "onClick": () => {
              selectNote(cell, "view");
            }
          }),
          h("i", {
            "class": "text-danger bi bi-x icon-table",
            "onClick": () => {
              selectNote(cell, "delete");
            }
          }),
        ]
      }
    },
  ];

  onMount(async () => {
    loading = true;
    try{
      const allResult = await NotesAPI.getNotes(role);
      const all: any[] = [];
      allResult.body.data.map((n) => {
        n.actions = n;
        all.push(n);
      })
      allNotes = all;
      filteredNotes = filterNotes();
    }catch(err){
    }finally{
      loading = false;
    }
  })

  const filterNotes = () => {
    if(selectedNoteType === "all"){
      return allNotes;
    }
    let newFilter: any[] = [];
    allNotes.map((n) => {
      if(n.noteType === selectedNoteType){
        newFilter.push(n);
      }
    })
    return newFilter;
  }

  const changeFilter = (e: any) => {
    loading = true;
    selectedNoteType = e.target.value;
    filteredNotes = filterNotes();
    loading = false;
  }

  const selectNote = (note: any, action: "view" | "delete") => {
    selectedNote = note;
    if(action === "view"){
      toggleNoteModal();
    } else {
      toggleDeleteModal();
    }
  }

  const toggleNoteModal = () => {
    showNoteModal = !showNoteModal;
  }

  const toggleDeleteModal = () => {
    showDeleteModal = !showDeleteModal;
  }

  const saveNote = async () => {
    loading = true;
    // sending the actions with the note causes an infinite recursion, so spread and delete
    const data = {
      ...selectedNote,
    };
    delete(data.actions);
    try{
      await NotesAPI.getNote(role, data.id);
      const r = await NotesAPI.updateNote(role, data.id, data);
      success("Saved!", "That note has been saved!");
      showNoteModal = false;
      const all: any[] = [];
      allNotes.map((n) => {
        if(n.id === selectedNote.id){
          all.push(selectedNote);
        } else {
          all.push(n);
        }
      });
      allNotes = all;
      filteredNotes = filterNotes();
    }catch(err){
      error("Uh oh", "We could not save that note!");
    }finally{
      loading = false;
    }
  }

  const deleteNote = async () => {
    loading = true;
    try{
      await NotesAPI.deleteNote(role, selectedNote.id);
      success("Saved!", "That note has been deleted!");
      showDeleteModal = false;
      const all: any[] = [];
      allNotes.map((n) => {
        if(n.id !== selectedNote.id){
          all.push(n);
        }
      });
      allNotes = all;
      filteredNotes = filterNotes();
    }catch(err){
      error("Uh oh", "We could not delete that note!");
    }finally{
      loading = false;
    }
  }

</script>

<Screen>
  <div class="row">
    <div class="col-12">
      <Card title="My Notes" {loading}>
        <div class="row">
          <div class="col-5">
            <label for="filter">Filter</label>
            <select class="form-control" bind:value={selectedNoteType} on:change={changeFilter}>
              <option value="all">All</option>
              <option value="journal">Journal</option>
              <option value="project">Project</option>
            </select>
          </div>
        </div>
        <Grid data={filteredNotes} columns={cols} sort={true} />
      </Card>
    </div>
  </div>

  <Modal isOpen={showNoteModal} toggle={toggleNoteModal} size="md">
    <ModalHeader toggle={toggleNoteModal}>{selectedNote.title}</ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" bind:value={selectedNote.title} />
      </div>
      <div class="form-group">
        <label for="body">Body</label>
        <textarea class="form-control" bind:value={selectedNote.body} />
      </div>
      <div class="form-group">
        <label for="visibility">Visibility</label>
        <select class="form-control" bind:value={selectedNote.visibility}>
          <option value="private">Private</option>
          <option value="admins">Admins</option>
        </select>
        {#if selectedNote.visibility === "private"}
          <span class="small">Note: While we will try to ensure this remains private, the administrators may be able to read from the database.</span>
        {/if}
      </div>
      <div class="form-group">
        Created on {translateDate(selectedNote.createdOn, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT)}
      </div>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={saveNote}>Save</button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} size="md">
    <ModalHeader toggle={toggleDeleteModal}>Delete Note</ModalHeader>
    <ModalBody>
      <strong class="text-danger">Warning:</strong> Are you sure you want to delete the note titled "{selectedNote.title}"? This cannot be undone!
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-danger" on:click={deleteNote}>Delete</button>
    </ModalFooter>
  </Modal>
</Screen>