/*
 * Copyright (C) 2013 The Minium Authors
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
package minium.pupino.config.cucumber;

import java.util.ArrayList;
import java.util.List;

import minium.pupino.config.cucumber.CucumberProperties.RemoteBackendProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.common.collect.Lists;

import cucumber.runtime.rest.RemoteBackend;

@Configuration
@EnableConfigurationProperties(CucumberProperties.class)
public class CucumberConfiguration {

    @Autowired
    private CucumberProperties cucumberProperties;

    @Bean
    public List<RemoteBackend> remoteBackends() {
        ArrayList<RemoteBackend> backends = Lists.newArrayList();
        for (RemoteBackendProperties remoteBackendProperties : cucumberProperties.getRemoteBackends()) {
            backends.add(remoteBackendProperties.createRemoteBackend());
        }
        return backends;
    }

}
