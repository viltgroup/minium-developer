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
package minium.pupino.web.rest.js;

import static com.vilt.minium.Minium.$;
import static java.lang.String.format;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import minium.pupino.webdriver.SelectorGadgetWebElements;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.vilt.minium.DefaultWebElementsDriver;

@Controller
@RequestMapping("/app/rest/js/selectorGadget")
public class SelectorGadgetResource {

	private static final Logger log = LoggerFactory.getLogger(SelectorGadgetResource.class);

	@Autowired
	@Lazy
	private DefaultWebElementsDriver wd;

	private boolean activated = false;

	@RequestMapping(value = "/activate", method = { POST, GET })
	public ResponseEntity<Void> activate() throws Exception {
		if (activated) {
			try {
				deactivate();
			} catch (Exception e) {
				log.warn("Could not deactivate selector gadget");
			}
		}

		SelectorGadgetWebElements elems = getSelectorGadgetWebElements();
		if (elems == null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		elems.activateSelectorGadget();
		activated = true;

		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	@RequestMapping(value = "/deactivate", method = { POST, GET })
	public ResponseEntity<Void> deactivate() throws Exception {
		SelectorGadgetWebElements elems = getSelectorGadgetWebElements();
		if (elems == null) {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
		elems.deactivateSelectorGadget();
		activated = false;
		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	@RequestMapping(value = "/cssSelector", method = { POST, GET })
	public ResponseEntity<SelectorGadgetResult> getCssSelector() throws Exception {
		SelectorGadgetWebElements elems = getSelectorGadgetWebElements();
		SelectorGadgetResult result = new SelectorGadgetResult();
		String cssSelector = elems.getCssSelector();
		activated = false;

		if (cssSelector != null) {
			result.setExpression(format("$(wd, \"%s\")", cssSelector));
		}
		return new ResponseEntity<SelectorGadgetResult>(result, HttpStatus.OK);
	}

	protected SelectorGadgetWebElements getSelectorGadgetWebElements() {
		return $(wd).as(SelectorGadgetWebElements.class);
	}
}
