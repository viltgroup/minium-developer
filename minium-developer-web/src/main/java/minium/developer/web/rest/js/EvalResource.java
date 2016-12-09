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
package minium.developer.web.rest.js;

import static org.springframework.web.bind.annotation.RequestMethod.POST;
import minium.BasicElements;
import minium.Elements;
import minium.FreezableElements;
import minium.actions.debug.DebugInteractable;
import minium.developer.project.AbstractProjectContext;
import minium.developer.project.Evaluation;
import minium.developer.project.Workspace;
import minium.web.EvalWebElements;
import minium.web.internal.actions.HighlightInteraction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.base.Preconditions;

@Controller
@RequestMapping("/app/rest/js")
public class EvalResource {

    @Autowired
    private Workspace workspace;

    @RequestMapping(value = "/eval")
    @ResponseBody
    public EvalResult eval(@RequestBody Evaluation evaluation) {
        try {
            Object result = getProjectContext().eval(evaluation);
            if (result instanceof Elements) {
                Elements elements = (Elements) result;
                boolean canHighlight = elements.is(DebugInteractable.class) && elements.is(FreezableElements.class);
                if (canHighlight) {
                    elements = elements.as(FreezableElements.class).freeze();
                }
                int totalCount = elements.as(BasicElements.class).size();
                if (totalCount > 0 && canHighlight) {
                    highlight(elements);
                }
                return new EvalResult(evaluation.getExpression(), totalCount);
            } else {
                return new EvalResult(getProjectContext().toString(result));
            }
        } catch (Exception e) {
            //logger.error("Evaluation of {} failed", evaluation.getExpression(), e);
            throw new EvalException(e);
        }
    }

    public void highlight(Elements elements) {
        try {
            // we cannot call DebugInteractable because it would trigger listeners, which we don't wants
            elements.as(EvalWebElements.class).eval(HighlightInteraction.HIGHLIGHT_EVAL_EXPR);
        } catch (Exception e) {
            // this is something that can happen, when for instance we evaluate a link click
            // because most likely the element will be stale after the click
        }
    }

    @RequestMapping(value = "/stacktrace")
    @ResponseBody
    public StackTraceElement[] stacktrace() {
        return getProjectContext().getExecutionStackTrace();
    }

    @RequestMapping(value = "/cancel")
    @ResponseBody
    public void cancel() {
        getProjectContext().cancel();
    }

    @RequestMapping(value = "/isRunning")
    @ResponseBody
    public boolean isRunning() {
        return getProjectContext().isRunning();
    }

    /**
     * Clean the scope
     * @return
     */
    @RequestMapping(value = "/clean", method = POST)
    @ResponseBody
    public synchronized ResponseEntity<Void> clean() {
        AbstractProjectContext activeProject = workspace.getActiveProject();
    	activeProject.resetEngine();
    	return new ResponseEntity<Void>(HttpStatus.OK);
    }

    protected AbstractProjectContext getProjectContext() {
        return Preconditions.checkNotNull(workspace.getActiveProject());
    }
}
