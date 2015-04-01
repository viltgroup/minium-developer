/*
 * Copyright (C) 2015 The Minium Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package minium.cucumber.report.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.hash.Hashing;

public class Embedding {

    @JsonView(Views.Public.class)
    @JsonProperty("mime_type")
    private String mimeType;

    @JsonView(Views.Full.class)
    private byte[] data;

    @JsonView(Views.Public.class)
    private String sha1Hash;

    public String getMimeType() {
        return mimeType;
    }

    public byte[] getData() {
        return data;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getSha1Hash() {
        if (sha1Hash == null && data != null) {
            sha1Hash = Hashing.sha1().hashBytes(data).toString();
        }
        return sha1Hash;
    }
}
