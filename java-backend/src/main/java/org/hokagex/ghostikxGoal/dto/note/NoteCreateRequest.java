package org.hokagex.ghostikxGoal.dto.note;

public class NoteCreateRequest {

    private String title;
    private String tag;

    public NoteCreateRequest() {}

    public NoteCreateRequest(String title, String tag) {
        this.title = title;
        this.tag = tag;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
